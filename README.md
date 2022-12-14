LIGAYA 
- This is a website where you can create and manage your events. You can also create groups and posts talking about different events.

   Note: This Project used NodeJs and MySQL to build the MVC Architecture model.

NPM PACKAGES
1. EXPRESS
2. EJS
3. BODY-PARSER
4. MYSQL
5. EXPRESS-SESSION
6. EXPRESS-MYSQL-SESSION
7. BCRYPT
8. DOTENV

CONNECTING TO DATABASE
- Step 1: Download and Extract the Zip File of the Project
- Step 2: Import the "ligaya.sql" from the database folder into your mysql workbench
- Step 3: Go to .env file and replace the variables inisde with your mysql's credentials
    
IF CONNECTING FAILED
- Step 1: Type " ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'; " into your query

   Note: 'password' is the password you use for your mysql workbench

- Step 2: Type " flush privileges; " into your query

OPENING SERVER
- Step 1: Open Command Prompt or Terminal
- Step 2: Use "cd" command to get inside the project folder
- Step 3: Use the command "node server.js" to open the website
- Step 4: Go to a browser and type the URL "localhost:3000"
