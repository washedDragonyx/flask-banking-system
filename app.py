
from flask import Flask, render_template, request, redirect, jsonify, Response
import sqlite3
import random
import uuid
import json


app = Flask(__name__)



@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/account', methods=('GET', 'POST'))
def account():
    if request.method == 'POST':
        try:
            name = request.form['name']
            surname = request.form['surname']
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            number = random.randint(100000000000000000000,900000000000000000000)
            account_id = hex(number)
            connection.execute('INSERT INTO accounts (name, surname, account_id, balance) VALUES (?, ?, ?, ?)', (name, surname, account_id, 0))
            connection.commit()
            connection.close()
            data = {
                "Name" : name,
                "Surname" : surname,
                "AccountID" : account_id,
                "Status": "Success"
            }
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
  
        return jsonify(data)
        
    if request.method == 'GET':
        try:
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            accounts = connection.execute('SELECT * FROM accounts').fetchall()
            json_obj = []
            for row in accounts:
                data = {
                    "name": row[1],
                    "surname": row[2],
                    "account_id": row[3],
                    "balance": row[4]
                }
                json_obj.append(data)

            connection.close()
            data = {
                "Status": "Success",
                "Accounts": json_obj
            }
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
        return jsonify(data)

@app.route('/api/account/<account_id>', methods=('GET', 'DELETE', 'PUT', 'PATCH' ,'POST' , 'HEAD'))
def account_id(account_id):
    if request.method == 'DELETE':
        try:
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            
            connection.execute('DELETE FROM accounts WHERE account_id = ?', (account_id,))
            connection.commit()
            connection.close()
            data = {
                "Status": "Success"
            }
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
        return jsonify(data) 
    
    if request.method == "GET" :
        try:
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            account = connection.execute('SELECT * FROM accounts WHERE account_id = ?', (account_id,)).fetchone()
            connection.close()
            if account is None:
                data = {
                    "Status": "Account "+str(account_id)+" not found"
                }
                return jsonify(data)

            json_obj = []
            
            connection = sqlite3.connect('transactions.db')
            connection.row_factory = sqlite3.Row
            transactions = connection.execute('SELECT * FROM transactions WHERE sender = ? OR receiver = ?', (account_id,account_id,)).fetchall()
            if transactions != None:

                json_obj = []
                for row in transactions:
                    data = {
                        "id": row[0],
                        "sender": row[1],
                        "receiver" : row[2],
                        "amount" : row[3],
                        "timestamp" : row[4]
                    }
                    json_obj.append(data)
            else:
                json_obj = []
            

            data = {
                "Name": account[1],
                "Surname": account[2],
                "AccountID": account[3],
                "CreatedAt": account[5],
                "Balance": account[4],
                "Transactions" : json_obj
            }
        except Exception as e:
            data = {
                "Status": "Error : "+str(e)
            }
        resp = Response(json.dumps(data), content_type='application/json', headers={'X-Sistema-Bancario': str(account[1])+";"+str(account[2])})
        return resp
    
    if request.method == "PUT":
        try:
            
            name = request.form['name']
            surname = request.form['surname']
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            connection.execute('UPDATE accounts SET name = ?, surname = ? WHERE account_id = ?', (name, surname, account_id,))
            connection.commit()
            connection.close()
            data = {
                "Status": "Success, names updated"
            }
            return jsonify(data)
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
            return jsonify(data)
    
    if request.method == "PATCH":
        try:
            parameter = str(list(request.form)[0])
            value = request.form[parameter]
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            connection.execute('UPDATE accounts SET '+str(parameter)+' = ? WHERE account_id = ?', (value, account_id,))
            connection.commit()
            connection.close()
            data = {
                "Status": "Success, "+str(parameter)+" updated"
            }
            return jsonify(data)
            
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
            return jsonify(data)
    
    if request.method == "POST":
        try: 
            amount= request.form["amount"]
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            account = connection.execute('SELECT * FROM accounts WHERE account_id = ?', (account_id,)).fetchone()
            if account is None:
                data = {
                    "Status": "Account "+str(account_id)+" not found"
                }
                return jsonify(data)

            if int(amount) >= 0:
                connection.execute('UPDATE accounts SET balance = balance + ? WHERE account_id = ?', (amount, account[3],))
                connection.commit()
                connection.close()
                connection = sqlite3.connect('transactions.db')
                connection.row_factory = sqlite3.Row
                transaction_id = str(uuid.uuid4())
                connection.execute('INSERT INTO transactions (id, sender, receiver, amount) VALUES (?, ?, ?, ?)', (transaction_id ,"Anonymous", account[3], amount,))
                connection.commit()
                connection.close()
                receiver_obj = {
                "Name": account[1],
                "Surname": account[2],
                "Balance": account[4]
                }
                data = {
                "Status": "Success",
                "Sender" : "Anonymous",
                "Receiver" : receiver_obj,
                "TransactionID" : transaction_id,
                "Amount" : amount
                }

                return jsonify(data)
            else:
                if int(amount) > int(account[4]):
                    data = {
                        "Status": "Error, insufficient funds"
                    }
                    return jsonify(data)
                else:
                    connection.execute('UPDATE accounts SET balance = balance - ? WHERE account_id = ?', (amount, account[3],))
                    connection.commit()
                    connection.close()
                    connection = sqlite3.connect('transactions.db')
                    connection.row_factory = sqlite3.Row
                    transaction_id = str(uuid.uuid4())
                    connection.execute('INSERT INTO transactions (id, sender, receiver, amount) VALUES (?, ?, ?, ?)', (transaction_id, account[3], "Withdrawal", amount,))
                    connection.commit()
                    connection.close()
                    sender_obj = {
                    "Name": account[1],
                    "Surname": account[2],
                    "Balance": account[4]
                    }
                    data = {
                    "Status": "Success",
                    "Sender" : sender_obj,
                    "Receiver" : "Withdrawal",
                    "TransactionID" : transaction_id,
                    "Amount" : amount
                    }

                    return jsonify(data)
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
            return jsonify(data)
    
    if request.method == "HEAD":
        try: 
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            account = connection.execute('SELECT * FROM accounts WHERE account_id = ?', (account_id,)).fetchone()
            connection.close()
            if account is None:
                return Response(status=404)
            resp = Response( content_type='application/json', headers={'X-Sistema-Bancario': str(account[1])+";"+str(account[2])})
        
            
            return resp
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }

@app.route('/api/transfer', methods=('POST', 'GET'))
def transfer_api():
    if request.method == 'POST':
        try:
            sender = request.form['from']
            receiver = request.form['to']
            amount = request.form['amount']
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            sender_account = connection.execute('SELECT * FROM accounts WHERE account_id = ?', (sender,)).fetchone()
            receiver_account = connection.execute('SELECT * FROM accounts WHERE account_id = ?', (receiver,)).fetchone()
            connection.close()
            if sender_account is None:
                data = {
                    "Status": "Sender account "+str(sender)+" not found"
                }
                return jsonify(data)
            if receiver_account is None:
                data = {
                    "Status": "Receiver account "+str(receiver)+" not found"
                }
                return jsonify(data)
            if int(amount) > int(sender_account[4]):
                data = {
                    "Status": "Insufficient funds"
                }
                return jsonify(data)
            if sender == receiver:
                data = {
                    "Status": "Sender and receiver cannot be the same"
                }
                return jsonify(data)
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            connection.execute('UPDATE accounts SET balance = balance - ? WHERE account_id = ?', (amount, sender,))
            connection.execute('UPDATE accounts SET balance = balance + ? WHERE account_id = ?', (amount, receiver,))
            connection.commit()
            connection.close()
            connection = sqlite3.connect('transactions.db')
            connection.row_factory = sqlite3.Row
            transaction_id = str(uuid.uuid4())
            connection.execute('INSERT INTO transactions (id, sender, receiver, amount) VALUES (?, ?, ?, ?)', (transaction_id ,sender, receiver, amount,))
            connection.commit()
            connection.close()
            sender_obj = {
                "Name": sender_account[1],
                "Surname": sender_account[2],
                "Balance": sender_account[4]
            }
            receiver_obj = {
                "Name": receiver_account[1],
                "Surname": receiver_account[2],
                "Balance": receiver_account[4]
            }
            
            data = {
                "Status": "Success",
                "Sender" : sender_obj,
                "Receiver" : receiver_obj,
                "TransactionID" : transaction_id,
                "Amount" : amount
            }

            return jsonify(data)
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
            return jsonify(data)

    if request.method == 'GET':
        return render_template('transfer.html')

@app.route('/api/divert', methods=('POST',))
def divert_api():
    if request.method == 'POST':
        try:
            transaction_id = request.form['id']
            connection = sqlite3.connect('transactions.db')
            connection.row_factory = sqlite3.Row
            transaction = connection.execute('SELECT * FROM transactions WHERE id = ?', (transaction_id,)).fetchone()
            connection.close()
            if transaction is None:
                data = {
                    "Status": "Transaction "+str(transaction_id)+" not found"
                }
                return jsonify(data)
            sender = transaction[2]
            receiver = transaction[1]
            amount = transaction[3]
            connection = sqlite3.connect('accounts.db')
            connection.row_factory = sqlite3.Row
            connection.execute('UPDATE accounts SET balance = balance - ? WHERE account_id = ?', (amount, sender,))
            connection.execute('UPDATE accounts SET balance = balance + ? WHERE account_id = ?', (amount, receiver,))
            connection.commit()
            connection.close()
            connection = sqlite3.connect('transactions.db')
            connection.row_factory = sqlite3.Row
            transaction_id = str(uuid.uuid4())
            connection.execute('INSERT INTO transactions (id, sender, receiver, amount) VALUES (?, ?, ?, ?)', (transaction_id ,sender, receiver, amount,))
            connection.commit()
            connection.close()
            data = {
                "Status": "Success"
            }
            return jsonify(data)
        except Exception as e:
            data = {
                "Status": "Error "+str(e)
            }
            return jsonify(data)

@app.route('/register')
def register():
    return render_template('register.html')


@app.route('/static/styles.css')
def styles():
    return render_template('/static/styles.css')