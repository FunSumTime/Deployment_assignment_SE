from flask import Flask
from flask import request
from db import DB

app = Flask(__name__)

# preflight for the non simple requests
@app.route("/boxers/<int:id>", methods=["OPTIONS"])
def do_preflight(id):
    return '',204, {"Access-Control-Allow-Origin":"*", 
                    "Access-Control-Allow-Methods":"PUT, DELETE",
                    "Access-Control-Allow-Headers":"Content-Type"}

####################
# data scheme
# (id, fist_name,last_name,wins,losses,gold)
####################


# route to pull all boxers from database
@app.route("/boxers", methods=["GET"])
def get_boxers():
    db = DB("Boxers.db")
    # grab the boxers from the database instance
    boxers = db.readAllRecords()
    return boxers, {"Access-Control-Allow-Origin": "*"}


#route to create a single boxer
@app.route("/boxers", methods=["POST"])
def create_boxer():
    # make a instance of the db
    db = DB("Boxers.db")
    # grab the data from the request
    d = {"first_name" : request.form['first_name'],
         "last_name" : request.form['last_name'],
         "wins": request.form['wins'],
         "loses": request.form['loses'],
         "gold": request.form['gold']}
    db.saveRecord(d)
    return "Created", 201,  {"Access-Control-Allow-Origin": "*"}

# take a id to get a single boxer
@app.route("/boxers/<int:id>", methods=["GET"])
def get_boxer(id):
    db = DB("Boxers.db")
    boxer = db.getRecord(id)
    return boxer, {"Access-Control-Allow-Origin": "*"}


# will take a id and delete the boxer from the database
@app.route("/boxers/<int:id>", methods=["DELETE"])
def delete_boxer(id):
    print("I am deleteing the boxer" , id)
    db = DB("Boxers.db")
    db.deleteRecord(id)
    
    return "Deleted", 200, {"Access-Control-Allow-Origin": "*"}

# get a id for a boxer and update their name record or gold
@app.route("/boxers/<int:id>", methods=["PUT"])
def edit_boxer(id):
    db = DB("Boxers.db")
    d = {"first_name" : request.form['first_name'],
         "last_name" : request.form['last_name'],
         "wins": request.form['wins'],
         "loses": request.form['loses'],
         "gold": request.form['gold']}

    db.editRecord(id,d)
    return "Edited", 201, {"Access-Control-Allow-Origin": "*"}

# to start the app
def main():
    app.run()

main()
