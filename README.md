# LiveFeed
CS261 Software Engineering Group Project

## Description
This is a web application which allows you to create events and templates and get feedback from attendees.

### Technologies Used
- MySQL
- PHP
- ReactJS

### Required Installs 
- NodeJS 
- MySQLWorkbench
- XAMPP

## Setup

### Frontend

1. Ensure you have downloaded Node
2. Within the /livefeed-frontend directory run "npm i" - this will install all relevant libraries
3. Run "npm start" - this should start up the website

### Backend

1. Within XAMPP directory, go to the "/htdocs" folder
2. Copy and Paste the "server" folder from the GitHub Repository over here
3. Start XAMPP and run "Apache Server" and "SQL Server" 
4. Start MySQLWorkbench and create a database in port 3306
5. Select a schema from the repository within the following directory "server/schemas/" 
6. In MySQLWorkbench, select **Server** -> **Data Import**. Insert the address of the previous selected schema into the *Insert from self-contained file* box and then click *Start Import* to import the structure and data
7. Copy the "/server/config.ini.bak" file to "/server/config.ini" and populate it with your DB login details
8. In the terminal, navigate to "/server/python" and run the commands
> pip3 install -r requirements.txt
9. Launch Python in the terminal and type the commands:
> import nltk
> 
> nltk.download()
10. Setup a PHP webserver on port 80 which points to the root LiveFeed directory as the source directory

## Running

1. Run the PHP webserver on port 80
2. Run the Python file: "/server/python/api.py"
3. Run the command "npm start" in the terminal in the directory "livefeed-frontend"