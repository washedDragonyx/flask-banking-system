import sqlite3

connection = sqlite3.connect('accounts.db')
with open('accounts.sql') as f:
    sql = f.read()
    connection.executescript(sql)
connection.commit()
connection.close()

connection = sqlite3.connect('transactions.db')
with open('transactions.sql') as f:
    sql = f.read()
    connection.executescript(sql)
connection.commit()
connection.close()