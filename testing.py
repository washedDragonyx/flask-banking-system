import requests
import time



data = {
    'amount' : '34'
}
#r = requests.post('http://127.0.0.1:5000/api/transfer', data=data)
r = requests.post('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16', data= data)
print(r)
print(r.headers)
print(r.text)