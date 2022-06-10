import requests
import time
import json


data = {
    'name' : 'nikolone'
}
#data = json.dumps(data)
print(data)
#headers = { "Content-Type": "application/json" }
r = requests.put('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16?name=nikolone&surname=zjacicic')
print(r)
print(r.headers)
print(r.text)