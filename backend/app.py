import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS # ALLOWS CROSS ORIGIN REQUESTS

app = Flask(__name__)
CORS(app) #enable for all
def create_database():
    connection = sqlite3.connect('database.db') # connects sqlite to file | else create
    cursor = connection.cursor() # create cursor for sql commands

    # create table if doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT
        )
    ''')

    connection.commit() #  save changes
    connection.close() # close connection

create_database() # call function

# route direct
@app.route('/')
# runs when someone visits the / URL
def home():
    return "Welcome to the Expense Tracker."

@app.route('/add_expense', methods=['POST']) #new route that listens for post
def add_expense():
    # get data from request
    data = request.get_json() # JSON input needed
    date = data.get('date')
    category = data.get('category')
    amount = data.get('amount')
    description = data.get('description', '') # default to empty string if not filled

    # return error if missing data
    if not date or not category or not amount:
        return jsonify({'error': 'Missing required fields: date, category, or amount'}), 400

    # insert data into db
    try:
        connection = sqlite3.connect('database.db')
        cursor = connection.cursor()

        # parameterized SQL query to insert securely and prevents SQL atks
        # ? = placeholders
        # pass data as tuple
        cursor.execute(''' 
            INSERT INTO expenses (date, category, amount, description)
            VALUES (?, ?, ?, ?) 
        ''', (date, category, amount, description))

        connection.commit()
        connection.close()

        return jsonify({'message': 'Expense added successfully.'}), 201 # successful
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500 #Internal server error

@app.route('/get_expenses', methods=['GET'])
def get_expenses():
    try:
        connection = sqlite3.connect('database.db') # connect to db
        cursor = connection.cursor()

        # base query
        query = "SELECT * FROM expenses where 1=1"
        params = []

        # potential paramerters from request
        category = request.args.get('category')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        min_amount = request.args.get('min_amount', type=float)
        max_amount = request.args.get('max_amount', type=float)

        # add filters/params to query if provided
        if category:
            query += " AND category = ?"
            params.append(category)
        if start_date:
            query += " AND date >= ?"
            params.append(start_date)
        if end_date:
            query += " AND date <= ?"
            params.append(end_date)
        if min_amount is not None:
            query += " AND amount >= ?"
            params.append(min_amount)
        if max_amount is not None:
            query += " AND amount <= ?"
            params.append(max_amount)


        # query all rows from 'expenses' table w params
        cursor.execute(query, params)
        rows = cursor.fetchall() # fetch all rows

        connection.close() # close off connection after done

        #convert rows to list of dictionaries for JSON
        expenses = []
        for row in rows:
            expenses.append({
                "id": row[0],
                "date": row[1],
                "category": row[2],
                "amount": row[3],
                "description": row[4]
            })
        
        return jsonify(expenses), 200 # successfull list as JSON
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500 # internal server error

# update the data of provided ID
@app.route('/update_expense/<int:id>', methods=['PUT'])
def update_expense(id):
    # get updated data from request
    data = request.get_json()

    # data retrieved
    date = data.get('date')
    category = data.get('category')
    amount = data.get('amount')
    description = data.get('description')

    # check if any fields provided to update
    if not any([date, category, amount, description]):
        return jsonify({'error': 'No fields to update provided'}), 400 # bad request
    
    try: 
        connection = sqlite3.connect('database.db')
        cursor = connection.cursor()

        # query to check if expense exists 
        cursor.execute('SELECT * FROM expenses where id = ? ', (id,))
        expense = cursor.fetchone()

        # query doesnt exist
        if not expense:
            connection.close()
            return jsonify({'error': f'Expense with ID {id} not found'}), 404

        # update fields provided
        if date:
            cursor.execute('UPDATE expenses SET date = ? WHERE id = ?', (date, id))
        if category:
            cursor.execute('UPDATE expenses SET category = ? WHERE id = ?', (category, id))
        if amount:
            cursor.execute('UPDATE expenses SET amount = ? WHERE id = ?', (amount, id))
        if description:
            cursor.execute('UPDATE expenses SET description = ? WHERE id = ?', (description, id))

        # save connection
        connection.commit()
        connection.close()

        return jsonify({'message': f'Expense with ID {id} has been successfully updated.'}), 200 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_expense/<int:id>', methods=['DELETE'])
def delete_expense(id):
    try: 
        connection = sqlite3.connect('database.db')
        cursor = connection.cursor()

        # check if expense exists
        cursor.execute('SELECT * FROM expenses WHERE id = ?', (id,))
        expense = cursor.fetchone()

        if not expense:
            connection.close()
            return jsonify({'error': f'Expense with ID {id} not found.'}), 404
        
        # delete expense
        cursor.execute('DELETE FROM expenses WHERE id = ?', (id,))
        connection.commit()
        connection.close()

        return jsonify({'message': f'Expense with ID {id} was successfully deleted.'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)