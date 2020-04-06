# OnlineBookstore
Description

## Getting Started

### To get the Node server running locally:

* Install MongoDB Community Edition (instructions) and run it by executing mongod
* Clone this repo
* Navigate to server directory
* npm install to install all required dependencies
* Create .env file under server directory, for example:
```
DATABASE=mongodb://localhost/yourDatabaseName
PORT=8000
```
* npm start to start the local server

### To get the React server running locally:

* Navigate to client directory
* npm install to install all required dependencies
* npm start to start the local server

## Application Structure


```bash
├── client
│   ├── node_modules 
│   ├── public    
│   ├── src
│   │   ├── app.js
│   │   ├── config/
│   │   ├── routes/
│   │   ├── models/
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
├── server
│   ├── node_modules 
│   ├── .env    
│   ├── .gitignore
│   ├── app.js
│   ├── package-lock.json
│   ├── package.json
├── README.md
```
## Functionality Overview


### General functionality:
* Sign Up
* Log In
* Display Product
### The general page breakdown looks like this:


