import requests
import json

def print_response(r):
    print(r)
    print(r.headers)
    print(r.text)

print('1 - Create a new account')
print('2 - Get all accounts in system')
print('3 - Delete an account with id 0x1616b7d219b22c2a43f')
print('4 - Get account info with id 6d550f3984a3c798cdbc')
print('5 - Add 100.55 to id 6d550f3984a3c798cdbc')
print('6 - Remove 100.55 from id 6d550f3984a3c798cdbc')
print('7 - Overwrite name and surname of id 0xec2b36bf1389737f16 with PUT')
print('8 - Overwrite name of id 0xec2b36bf1389737f16 with PATCH')
print('9 - Get name and surname of id 0xec2b36bf1389737f16 with HEAD')
print('10 - Transfer 50 from 0xec2b36bf1389737f16 to 0xacea6fef1cac5c24b5')
print('11 - Divert transaction with id fa24925b-bfc8-4dee-a0c2-5b7d5ac86e40')

choice = input('Choose the request to make : ')


if choice == '1':
    data = {
        'name': 'Mike',
        'surname': 'Maignan'
    }
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    r = requests.post('http://127.0.0.1:5000/api/account',headers=headers, data=data)
    print_response(r)

elif choice == '2':
    r = requests.get('http://127.0.0.1:5000/api/account')
    print_response(r)

elif choice == '3':
    r = requests.delete('http://127.0.0.1:5000/api/account?id=0x1616b7d219b22c2a43f')
    print_response(r)

elif choice == '4':
    r = requests.get('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16')
    print_response(r)

elif choice == '5':
    data = {
        'amount':'100.55'
        }
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    #application/x-www-form-urlencoded
    r = requests.post('http://127.0.0.1:5000/api/account/6d550f3984a3c798cdbc',headers=headers, data=data)
    print_response(r)

elif choice == '6':
    data = {
        'amount':'-100.55'
        }
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    r = requests.post('http://127.0.0.1:5000/api/account/6d550f3984a3c798cdbc',headers=headers, data=data)
    print_response(r)

elif choice == '7':
    data = {
        'name': 'Mike',
        'surname': 'Maignan'
    }
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    r = requests.put('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16', headers = headers, data = data)
    print_response(r)

elif choice == '8':
    data = {
        'name': 'Mike',
        
    }
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    r = requests.patch('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16', headers = headers, data = data)
    print_response(r)
elif choice == '9':
    r = requests.head('http://127.0.0.1:5000/api/account/0xec2b36bf1389737f16')
    print_response(r)

elif choice == '10':
    data = {
        'from': '0xec2b36bf1389737f16',
        'to': '0xacea6fef1cac5c24b5',
        'amount': '50'
    }
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    r = requests.post('http://127.0.0.1:5000/api/transfer',headers=headers, data=data )
    print_response(r)

elif choice == '11':
    data = {'id':'fa24925b-bfc8-4dee-a0c2-5b7d5ac86e40'}
    data = json.dumps(data)
    headers = { "Content-Type": "application/json" }
    r = requests.post('http://127.0.0.1:5000/api/divert',headers=headers, data=data )
    print_response(r)









