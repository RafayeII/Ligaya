NPM PACKAGES
1. EXPRESS
2. EJS
3. BODY-PARSER
4. MYSQL
5. EXPRESS-SESSION
6. EXPRESS-MYSQL-SESSION
7. BCRYPT

OPENING SERVER
Step 1: Open Command Prompt
Step 2: Use "cd" command to get inside the project folder
Step 3: Use the command "nodemon server.js"
Step 4: Go to browser and type the URL "localhost:3000"

CONNECTING TO DATABASE
Step 1: Import the "ligaya" database into your mysql workbench
Step 2: Go to server.js file and replace data inisde 'const db' with your mysql's credentials
    IF CONNECTING FAILED
        Step 1: Type "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';" into your query
            Note: 'password' is the password you use for your mysql
        Step 2: Type 'flush privileges;' into your query
