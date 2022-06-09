import requests
import time



data = {
    'from' :'0xec2b36bf1389737f16',
    'to' : '0x18efea0cad915ea1fb',
    'amount' : '34'
}
r = requests.post('http://127.0.0.1:5000/api/transfer', data=data)
print(r.text)
print(r)