from google.auth.transport import requests
from google.oauth2 import id_token
from dotenv import load_dotenv
import os

load_dotenv()

def authn_user(token):
    GSUITE_DOMAIN_NAME = "iith.ac.in"
    CLIENT_ID = os.getenv("CLIENT_ID")
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        # Or, if multiple clients access the backend server:
        # idinfo = id_token.verify_oauth2_token(token, requests.Request())
        if idinfo['aud'] not in [CLIENT_ID]:
            raise ValueError('Could not verify audience.')

        # If auth request is from a G Suite domain:
        if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            raise ValueError('Wrong hosted domain. Only IITH users are allowed')
        
        # print(idinfo)
        email = idinfo['email']
        name = idinfo['name']
        picture = idinfo['picture']

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']

        return email, name, picture

    except ValueError:
        # Invalid token
        return None