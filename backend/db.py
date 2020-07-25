# initialising the sqlite3 database
# handle db operations - initialising db from sql, getting db connections
import sqlite3

def get_conn():
    conn = None
    try:
        conn = sqlite3.connect('skills.db')
    except Error as e:
        print(e)
    
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_db():
    db = sqlite3.connect('skills.db')
    load_schema(db)
    insert_data(db)
    load_skills(db)

    db.commit()
    db.close()

# read schema from db.sql into skills.db
def load_schema(db):
    with open('db_data/db.sql', 'r') as sql_file:
        sql_script = sql_file.read()
    cursor = db.cursor()
    cursor.executescript(sql_script)

# insert sample data from db_insert.sql into skills.db
def insert_data(db):
    with open('db_data/db_insert.sql', 'r') as sql_file:
        sql_script = sql_file.read()
    cursor = db.cursor()
    cursor.executescript(sql_script)

def load_skills(db):
    f = open('./linkedin_skills.txt', "r")
    cursor = db.cursor()
    count = 0
    for line in f:
        count += 1
        if (count % 2 == 0):
            try:
                cursor.execute("INSERT OR IGNORE INTO Skill (name) VALUES (?)", (line.rstrip(),))
            except sqlite3.IntegrityError as e:
                print(e)
    db.commit()
    f.close()


if __name__ == "__main__":
    init_db()
