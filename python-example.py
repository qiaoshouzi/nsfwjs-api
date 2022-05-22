import requests

def main():
    with open('tmp.jpg', 'rb') as r:
        image = r.read()
    r.close()
    req = requests.post('http://127.0.0.1:3000/nsfw', image).json()
    if req['code'] != 200:
        print('Error:', req['msg'])
    else:
        reqData = req['data']
        for i in reqData:
            print(i+': '+str(reqData[i]))

if __name__ == '__main__':
    main()
