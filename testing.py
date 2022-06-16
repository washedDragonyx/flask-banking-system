import requests
import time
import json


data = {
    'from': '0xec2b36bf1389737f16',
    'to': '0xec2b36bf1389737f16',
    'amount': '420'
    }
data = {'id':'5f557984-d189-4ef3-8af8-4532c0fb3023'}

data = json.dumps(data)
print(data)
headers = { "Content-Type": "application/json" }
r = requests.post('http://127.0.0.1:5000/api/divert',headers=headers, data=data )
print(r)
print(r.headers)
print(r.text)