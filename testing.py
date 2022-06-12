import requests
import time
import json


data = {
    'from': '0xec2b36bf1389737f16',
    'to': '0x2f3871eef140ee5b0d0',
    'amount': '10'   
    }

#data = json.dumps(data)
print(data)
headers = { "Content-Type": "application/x-www-form-urlencoded" }
r = requests.get('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f162',headers=headers )
print(r)
print(r.headers)
print(r.text)