using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.VisualBasic;
using System.Data.SqlClient;
using System.Diagnostics;

namespace AssistantEdit
{
    public partial class Window : Form
    {
        public Window()
        {
            InitializeComponent();
        }

        private void Window_Load(object sender, EventArgs e)
        {
            updateGrid();
        }

        public void updateGrid()
        {
            dataGridView1.ReadOnly = true;
            string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
            SqlConnection con = new SqlConnection(connectionString);
            SqlCommand cmd = new SqlCommand("select * from Apps", con);
            con.Open();
            DataTable dt = new DataTable();
            SqlDataAdapter adapter = new SqlDataAdapter(cmd);
            adapter.Fill(dt);
            con.Close();
            dataGridView1.DataSource = dt;
            dataGridView1.AutoResizeColumns();
            dataGridView1.AutoResizeRows();
        }

        private void AddButton_Click(object sender, EventArgs e)
        {
            try
            {
                string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
                SqlConnection con = new SqlConnection(connectionString);
                SqlCommand cmd = new SqlCommand("select Location from Apps where Name=@name", con);
                cmd.Parameters.AddWithValue("@name", AddName.Text);
                con.Open();
                string catchError = cmd.ExecuteScalar().ToString();

                MessageBox.Show("Entry already exists");
                con.Close();
            }
            catch
            {
                string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
                SqlConnection con = new SqlConnection(connectionString);
                SqlCommand cmmd = new SqlCommand("insert into Apps(Name,Location) values(@name,@location)", con);
                cmmd.Parameters.AddWithValue("@name", AddName.Text);
                cmmd.Parameters.AddWithValue("@location", AddLocation.Text);
                con.Open();
                cmmd.ExecuteNonQuery();
                con.Close();
            }
        }
        /*
        private void LookupButton_Click(object sender, EventArgs e)
        {
            try
            {
                string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
                SqlConnection con = new SqlConnection(connectionString);
                SqlCommand cmd = new SqlCommand("select Location from Apps where Name=@name", con);
                cmd.Parameters.AddWithValue("@name", LookupBox.Text);
                con.Open();
                LookupLabel.Text = cmd.ExecuteScalar().ToString();
                con.Close();

            }
            catch (Exception ex)
            {
                LookupLabel.Text = "Invalid Entry";
            }
        }
        */

        private void EditButton_Click(object sender, EventArgs e)
        {
            try
            {
                string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
                SqlConnection con = new SqlConnection(connectionString);
                SqlCommand cmd = new SqlCommand("select Location from Apps where Name=@name", con);
                cmd.Parameters.AddWithValue("@name", EditName.Text);
                con.Open();
                string catchError = cmd.ExecuteScalar().ToString();

                SqlCommand cmmd = new SqlCommand("update Apps set Location=@location where Name=@name", con);
                cmmd.Parameters.AddWithValue("@name", EditName.Text);
                cmmd.Parameters.AddWithValue("@location", EditLocation.Text);
                cmmd.ExecuteNonQuery();
                con.Close();

            }
            catch
            {
                MessageBox.Show("Error - Invalid Name");
            }
        }

        private void DeleteButton_Click(object sender, EventArgs e)
        {
            try
            {
                //checks if item to be deleted exists
                string connectionString = @"Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=C:\Users\itzmy\source\repos\Assistant\Assistant\Database1.mdf;Integrated Security=True";
                SqlConnection con = new SqlConnection(connectionString);
                SqlCommand cmd = new SqlCommand("select * from Apps where Name=@name and Location=@location", con);
                cmd.Parameters.AddWithValue("@name", DeleteName.Text);
                cmd.Parameters.AddWithValue("@location", DeleteLocation.Text);
                con.Open();
                string catchError = cmd.ExecuteScalar().ToString();
                

                SqlCommand cmmd = new SqlCommand("delete from Apps where Name=@name and Location=@location", con);
                cmmd.Parameters.AddWithValue("@name", DeleteName.Text);
                cmmd.Parameters.AddWithValue("@location", DeleteLocation.Text);
                cmmd.ExecuteNonQuery();
                con.Close();
            }
            catch
            {
                MessageBox.Show("Entry does not exist");
            }
        }

        private void RefreshButton_Click(object sender, EventArgs e)
        {
            foreach(Process process in Process.GetProcessesByName("Assistant")){
                process.Kill();
            }
            try
            {
                Process.Start("C:\\Users\\itzmy\\source\\repos\\Assistant\\Assistant\\bin\\Debug\\Assistant.exe");
            }
            catch(Exception except)
            {
                MessageBox.Show(except.ToString());
            }
            updateGrid();
        }
    }
}
