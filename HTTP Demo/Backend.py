import pyodbc
from flask import Flask,render_template,request,jsonify
from ConnectionString import connectionString # imports connection string from outside file
import json

conn = pyodbc.connect(connectionString) # A connection string for the database using imported string
cursor = conn.cursor() #Creates a cursor to execute queries

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST', 'PUT', 'DELETE', 'VIEW'])
def index():

    if request.method == "VIEW": #A method that returns data for you to view, but does not return a webpage like the GET request does
        try:
            data = request.get_json() # Gets json data from request
            cursor.execute("SELECT Vote FROM dbo.Table_1 WHERE FirstName=? AND LastName=?",data["first"],data["last"]) # sql query
            cursorOutput = cursor.fetchone() # gets first row from query
            return jsonify({"vote":cursorOutput.Vote,"status":"200 OK"}) # returns status and the output of the query to the ajax call
        except: # An error occurred
            return jsonify({"vote":"Invalid Information","status":"400"}) # returns data to display and an error code
    
    if request.method == "POST":
        try:
            data = request.get_json() # Gets json data from request
            try: # This will try to find a duplicate name and a vote for that name. If no duplicate exists, it will continue with the program.
                cursor.execute("SELECT Vote FROM dbo.Table_1 WHERE FirstName=? AND LastName=?",data["first"],data["last"]) # sql query
                cursorAll = cursor.fetchone()
                catchError = cursorAll.Vote # If no duplicate exists, this will be unable to be found and return an error
                return jsonify({"message":"Name Already Exists","status":"400"}) # Returns a message to display to the user in the ajax error function
            except:
                cursor.execute("INSERT INTO dbo.Table_1(FirstName, LastName, Vote) VALUES(?, ?, ?)",data["first"],data["last"],data["vote"]) # sql query
                conn.commit() # commits changes to database
                return jsonify({"message":"Success!","status":"200 OK"}) # Returns a message to display to the user in the ajax success function
        except: # An error occurred
            return jsonify({"message":"Unsuccessful","status":"400"}) # returns message to display and an error code

    if request.method == "PUT":
        try:
            data = request.get_json() # Gets json data from request
            cursor.execute("UPDATE dbo.Table_1 SET Vote=? WHERE FirstName=? AND LastName=?",data["vote"],data["first"],data["last"]) # sql query
            conn.commit() # commits changes to database
            return jsonify({"message":"Success!","status":"200 OK"}) # Returns a message to display to the user in the ajax success function
        except: # An error occurred
            return jsonify({"message":"Unsuccessful","status":"400"}) # returns message to display and an error code
    
    if request.method == "DELETE":
        try:
            data = request.get_json() # Gets json data from request
            try: # This will try to find a duplicate name and a vote for that name. If no duplicate exists, it will continue with the program.
                cursor.execute("SELECT Vote FROM dbo.Table_1 WHERE FirstName=? AND LastName=?",data["first"],data["last"]) # sql query
                cursorAll = cursor.fetchone()
                catchError = cursorAll.Vote # If no duplicate exists, this will be unable to be found and return an error
                cursor.execute("DELETE FROM dbo.Table_1 WHERE FirstName=? AND LastName=? AND Vote=?",data["first"],data["last"],data["vote"]) # sql query
                conn.commit() # commits changes to database
                return jsonify({"message":"Success!","status":"200 OK"}) # Returns a message to display to the user in the ajax success function
            except:
                return jsonify({"message":"Vote Does Not Exist","status":"400"}) # Returns a message to display to the user in the ajax error function
        except: # An error occurred
            return jsonify({"message":"Unsuccessful","status":"400"}) # returns message to display and an error code

    return render_template('index.html') # GET request


if __name__ == "__main__": #Allows flask to start hosting by running main
    app.run()
    cursor.close()
    conn.close()