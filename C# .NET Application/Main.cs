using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Speech.Synthesis;
using System.Speech.Recognition;
using Microsoft.VisualBasic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Windows;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using PuppeteerSharp;
using System.Threading;


namespace Assistant
{
    public partial class Main : Form
    {
        public Main()
        {
            InitializeComponent();
        }

        DataTable dt = new DataTable();

        private void Form1_Load(object sender, EventArgs e)
        {
            SpeechRecognizer sr = new SpeechRecognizer();
            string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
            SqlConnection con = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand("select Name,Location from Apps", con);
            con.Open();
            SqlDataAdapter adapter = new SqlDataAdapter(cmd);
            adapter.Fill(dt);
            foreach (DataRow row in dt.Rows)
            {
                GrammarBuilder gb = new GrammarBuilder(row["Name"].ToString());
                Grammar gr = new Grammar(gb);
                sr.LoadGrammar(gr);
                //MessageBox.Show("Loaded Grammar: " + row["Name"].ToString());
            }
            con.Close();
            GrammarBuilder gmb = new GrammarBuilder("play a video");
            Grammar gmr = new Grammar(gmb);
            sr.LoadGrammar(gmr);
            gmb = new GrammarBuilder("search the internet");
            gmr = new Grammar(gmb);
            sr.LoadGrammar(gmr);
            gmb = new GrammarBuilder("what day is it");
            gmr = new Grammar(gmb);
            sr.LoadGrammar(gmr);
            gmb = new GrammarBuilder("what time is it");
            gmr = new Grammar(gmb);
            sr.LoadGrammar(gmr);
            gmb = new GrammarBuilder("id");
            gmr = new Grammar(gmb);
            sr.LoadGrammar(gmr);
            
            gmb = new GrammarBuilder("is today the day");
            gmr = new Grammar(gmb);
            sr.LoadGrammar(gmr);
            

            sr.SpeechRecognized += new EventHandler<SpeechRecognizedEventArgs>(speechrec);

        }

        void speechrec(object send, SpeechRecognizedEventArgs eargs)
        {
            //EVENT HANDLER IS BEING CALLED, BUT ONLY WRITE FILE IS CALLED - code inside if statement is not being called
            System.IO.File.WriteAllText("errorLog.txt", "Event handler called - recognized text is '" + eargs.Result.Text + "'\n" + (eargs.Result.Text == "chrome" || eargs.Result.Text == "youtube").ToString());
            foreach (DataRow row in dt.Rows)
            {
                if (eargs.Result.Text == row["Name"].ToString())
                {
                    Process.Start(row["Location"].ToString());
                    break;
                }
            }
            if (eargs.Result.Text == "play a video")
            {
                string searchterm = "";
                searchterm = Interaction.InputBox("Enter Search Term", "", "");
                Process.Start("https://www.youtube.com/results?search_query=" + searchterm);
            }
            else if (eargs.Result.Text == "search the internet")
            {
                string searchterm = "";
                searchterm = Interaction.InputBox("Enter Search Term", "", "");
                Process.Start("http://www.google.com/search?q=" + searchterm);
            }
            else if (eargs.Result.Text == "what day is it")
            {
                DateTime datetime = DateTime.Now;
                SpeechSynthesizer synthesizer = new SpeechSynthesizer();
                synthesizer.Volume = 100;
                synthesizer.Speak("Today is " + datetime.DayOfWeek + datetime.ToString("MMMM") + datetime.Day);
            }
            else if (eargs.Result.Text == "what time is it")
            {
                DateTime datetime = DateTime.Now;
                SpeechSynthesizer synthesizer = new SpeechSynthesizer();
                synthesizer.Volume = 100;
                synthesizer.Speak("It is " + datetime.Hour + " " + datetime.Minute);
            }
            else if (eargs.Result.Text == "id")
            {
                Clipboard.SetText("76561198823364377");
            }

            else if (eargs.Result.Text == "is today the day")
            {
                async Task<int> getDestinyInfo()
                {


                    //my membership id is 4611686018486011535
                    //my character id is 2305843009412654813
                    //my bungie.net id is 20451238

                    //FIND HASHES AND ITEM IDENTIFIERS IN LINKS FOUND IN https://www.bungie.net/Platform/Destiny2/Manifest/ - THE FIRST SET OF LINKS ARE ENGLISH, THE OTHERS ARE IN FOREIGN LANGUAGES
                    //spider hash is 863940356
                    //legendary shards id is 1022552290
                    //glimmer id is 3159615086
                    //purchase simulation seeds id is 1420498062 - SPIDER DOES NOT USE THE HASH FOR THE PLANETARY ITEMS, BUT RATHER THE HASH FOR PURCHASING THE ITEM

                    async Task<string> getAuthenticationCode()
                    {
                        await new BrowserFetcher().DownloadAsync(BrowserFetcher.DefaultRevision);
                        using (var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                        {
                            Headless = true,
                            UserDataDir = "C:\\Users\\itzmy\\source\\repos\\Assistant\\Assistant\\bin\\Debug\\.local-chromium\\Win64-706915\\chrome-win\\Data"
                        }))
                        {
                            var page = await browser.NewPageAsync();
                            await page.GoToAsync("https://www.bungie.net/en/oauth/authorize?client_id=32722&response_type=code");

                            ElementHandle checkPath = await page.QuerySelectorAsync("a.button-steam.control-kit.button.gold.medium.js-steam.clickable");
                            string authenticationCode;

                            if (checkPath != null)
                            {
                                //not signed in yet
                                await page.ClickAsync("a.button-steam.control-kit.button.gold.medium.js-steam.clickable");

                                Thread.Sleep(2000);
                                await page.TypeAsync("#steamAccountName", "ShakerSam1");

                                await page.TypeAsync("#steamPassword", "QuiteInteresting?");
                                await page.ClickAsync("#imageLogin");
                                Thread.Sleep(7000);
                                authenticationCode = page.Url;
                                authenticationCode = authenticationCode.Remove(0, 29);
                                return authenticationCode;


                            }
                            else
                            {
                                //signed in already
                                authenticationCode = page.Url;
                                authenticationCode = authenticationCode.Remove(0, 29);
                                return authenticationCode;
                            }

                        }
                    }

                    using (HttpClient client = new HttpClient())
                    {
                        string code = await getAuthenticationCode();

                        var tokenContent = new FormUrlEncodedContent(new KeyValuePair<string, string>[]
                        {
                                new KeyValuePair<string, string>("Content-Type", "application/x-www-form-urlencoded"),
                                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                                new KeyValuePair<string, string>("code", code),
                                new KeyValuePair<string, string>("client_id", "32722"),
                                new KeyValuePair<string, string>("client_secret", "LPZOwRSPjSOF.2jBIt9cNjChnO3Y6VMoqbVdQvLy568")
                        });

                        HttpResponseMessage tokenResponse = await client.PostAsync("https://www.bungie.net/platform/app/oauth/token/", tokenContent);

                        string messageString = await tokenResponse.Content.ReadAsStringAsync();

                        JObject message = JObject.Parse(messageString);

                        string accessToken = message["access_token"].ToString();

                        HttpRequestMessage vendorRequest = new HttpRequestMessage(HttpMethod.Get, "https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018486011535/Character/2305843009412654813/Vendors/863940356/?components=401,402");
                        vendorRequest.Headers.Add("X-API-Key", "30b3680077344d94888fed9420fd1ac6");
                        vendorRequest.Headers.Add("Authorization", "Bearer " + accessToken);

                        HttpResponseMessage vendorResponse = await client.SendAsync(vendorRequest);

                        string responseFromVendors = await vendorResponse.Content.ReadAsStringAsync();

                        responseFromVendors = JValue.Parse(responseFromVendors).ToString(Newtonsoft.Json.Formatting.Indented);

                        //System.IO.File.WriteAllText("spiderSalesNew.txt", responseFromVendors);

                        JObject spiderSales = JObject.Parse(responseFromVendors);

                        int counter = 1;

                        foreach (JProperty sale in spiderSales["Response"]["sales"]["data"])
                        {
                            JToken hashOfItemForSale = sale.Value.SelectToken("itemHash");

                            JToken hashOfPriceItem = sale.Value.SelectToken("costs[0].itemHash");

                            if (hashOfItemForSale.ToString() == "1420498062" && hashOfPriceItem.ToString() == "1022552290")
                            {
                                SpeechSynthesizer synthesizer = new SpeechSynthesizer();
                                synthesizer.Volume = 100;
                                synthesizer.Speak("today is the day");
                                break;
                            }
                            else if (counter >= 7)
                            {
                                SpeechSynthesizer synthesizer = new SpeechSynthesizer();
                                synthesizer.Volume = 100;
                                synthesizer.Speak("today is not the day");
                                break;
                            }

                            counter++;

                        }

                        vendorRequest.Dispose();
                    }

                    Application.Restart();

                    return 1;
                }

                Task<int> isItToday = getDestinyInfo();
            }


        }

        private void Main_Shown(object sender, EventArgs e)
        {
            this.Hide();
        }
    }
}
