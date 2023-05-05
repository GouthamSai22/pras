# PRAS
The Postal Room at IIT Hyderabad is currently closed due to the inefficient handling of a large volume of parcels received on a daily basis. The root of the problem is the use of handwritten registers for inventory, which takes over 2 hours a day to fill. The Postal Room Automation System (PRAS) is aimed at eliminating this manual labor and creating an automated system to efficiently handle the parcels. This system saves time, effort, and resources like paper.

## Launch React App:
1. ```npm install```
2. ```npm run start```

## Start Backend:
1. ```pip install -r requirements.txt```
2. ```uvicorn main:app```

## Postgres
1. Create database named `pras`
2. Add tables given in `init.sql`
3. Create a local `.env` file by substituting values in the `.env.example` file
