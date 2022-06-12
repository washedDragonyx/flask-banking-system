import requests
import time
import json


data = {
    'amount': '-100'   
    }

data = json.dumps(data)
print(data)
headers = { "Content-Type": "application/json" }
r = requests.post('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16',headers=headers, data=data )
print(r)
print(r.headers)
print(r.text)