# Set Up application in your local
* open terminal and run the following commands
1. git clone https://github.com/Hashah1/cmpe138Project.git
2. cd cmpe138Project/VPN_management
3. git pull origin master

# Database Connection
1. db_config contains the mysql connection string.
2. create database named 'vpn_management' in your local mysql instance.
3. Update this string in db_config file {host: "localhost",user: "your_username",password: "*******",database:"vpn_management"}

# Running the App
1. npm i
2. node app.js or nodemon app.js or npm start

# Web Browser
 go to the browser and enter localhost:9000