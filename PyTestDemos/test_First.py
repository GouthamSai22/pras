import requests
import json


def test_1():

    url = "http://localhost:8000/add-package"

    payload = {
        "package_number": "AWB1007",
        "package_type": "Amazon",
        "owner_name": "Vikhyath Sai Kothamasu"
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, data=json.dumps(payload), headers=headers)

    if response.status_code == 200:
        # Success
        result = response.json()
        expected = {'result' : 'success'}
    else:
        # Error
        result = {"error": f"Failed with status code {response.status_code}"}
        expected = {'error' : f"Failed with status code {response.status_code}"}

    

    assert result == expected



def test_2():

    url = 'http://localhost:8000/modify-package'
    headers = {
        'Content-Type': 'application/json'
    }
    payload = {
        'package_id': "1",
        'package_number': "AWB1003",
        'package_type': "Amazon",
        'owner_name': "Vikhyath Sai Kothamasu",
        'status': "collected"
    }

    response = requests.request(
        'BATCH', url, headers=headers, data=json.dumps(payload))
    
    if response.status_code == 200:
        result = response.json()
        expected = {'result' : 'success'}
    else:
        result = {"error": f"Failed with status code {response.status_code}"}
        expected = {"error": f"Failed with status code {response.status_code}"}

    assert result == expected





def test_3():

    url = 'http://localhost:8000/delete-package'
    data = {'package_id': "AW1006"}
    headers = {'Content-Type': 'application/json'}

    response = requests.delete(url, headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()
        expected = {'result' : 'success'}
        # Handle the JSON response here
    else:
        result = {"error": f"Failed with status code {response.status_code}"}
        expected = {"error": f"Failed with status code {response.status_code}"}

    assert result == expected







