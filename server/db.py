import sqlite3


#  to make the sql that comes back into our dictionary formate
def dict_factory(cursor, row):
    fields = []
    # Extract column names from cursor description
    for column in cursor.description:
        fields.append(column[0])

    # Create a dictionary where keys are column names and values are row values
    result_dict = {}
    for i in range(len(fields)):
        result_dict[fields[i]] = row[i]

    return result_dict

####################
# data scheme
# (id, fist_name,last_name,wins,losses,gold)
# Table
# boxers
####################

class DB:
    def __init__(self, dbfilename):
        self.dbfilename = dbfilename
        self.connection = sqlite3.connect(dbfilename)
        self.cursor = self.connection.cursor()

    def readAllRecords(self):
        self.cursor.execute("SELECT * FROM boxers")
        rows = self.cursor.fetchall()
        all_rows = []
        for row in rows:

            d = dict_factory(self.cursor, row)
            all_rows.append(d)
        return all_rows


    def saveRecord(self,record):
        data = [record["first_name"],record["last_name"], record["wins"], record["loses"], record["gold"]]
        # dont do the hard coded to protect againts injecting

        self.cursor.execute("INSERT INTO boxers (first_name,last_name,wins,loses,gold) VALUES ( ?,?,?,?,?);", data)
        # make the change in the file be commited
        self.connection.commit()
    def deleteRecord(self,id):
        self.cursor.execute("DELETE FROM boxers WHERE id = ?;", [id])

        self.connection.commit()

    def editRecord(self,id,d):
        data = [d["first_name"],d["last_name"], d["wins"], d["loses"], d["gold"],id]
        self.cursor.execute("UPDATE boxers SET first_name=?, last_name=?, wins=?, loses=?, gold=? WHERE id = ?;", data)
        

        self.connection.commit()
    
    def getRecord(self,id):
        self.cursor.execute("SELECT * FROM boxers WHERE id = ?;", [id])
        rows = self.cursor.fetchall()
        all_rows =[]
        for row in rows:
            d = dict_factory(self.cursor, row)
            all_rows.append(d)
        return all_rows

    def getRecord(self,id):
        self.cursor.execute("SELECT * FROM boxers WHERE id = ?;", [id])
        rows = self.cursor.fetchall()
        all_rows =[]
        for row in rows:
            d = dict_factory(self.cursor, row)
            all_rows.append(d)
        return all_rows


    def clos(self):
        self.connection.close()
