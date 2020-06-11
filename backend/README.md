# Developing
## Setting Up
1. Make sure you have Python3.7 installed.
2. Create a Python virtual environment
3. Activate the virtual environment - run command `source .venv/bin/activate`
    - If this is successful there will be a (.venv) at the front of your terminal
4. Install all the relevant dependencies into your virtual environment
    - this can be done with the command `pip3 install -r requirements.txt`
    - this only needs to be done at setup, and when additional packages are added to the project


## Running the API
1. Make sure you have the virtual environment activated before you do anything
2. Run `python3 db.py` to initialise the database. This will create the local file learning.db.  
3. Run `python3 app.py` to run the API.

* If you need to reload the database (when adding new data or changing the schema), run `python3 db.py` after making any changes to load them into the database.