# NC-News
## What Is NC-News?
NC-News is an API written in JavaScript that contains various endpoints, displaying articles, comments and topics depending on the path, as well as queries. It utilises Express, Knex and SQL as dependencies, and was tested using Supertest, Mocha and Chai as dev-dependencies.

* The NC-News app is currently hosted at: http://bowie-nc-news.herokuapp.com/api/ 


## Getting Started
Fork the project and clone it into your teminal using 

    git clone <HTTPS>

Make sure to install Supertest, Mocha and Chai as dev-dependencies

    npm install -D mocha chai supertest

Make sure to install PG, Knex and Express as dependencies

    npm install pg knex express


The package.json file contains a full list of 'npm run' commands; the first one you'll need will be 'npm run setup-dbs', which will be outlined more specifically later in this guide.

Have a look through the migration directory for the database schemas, which currently includes Articles, Comments, Topics, Users (There are individual data folders for the testing and development environments, which are already set in the project - Have a look inside the 'knexfile.js' and 'connection.js' files to see how the environment is set using a dbConfig exported object).

## Prerequisites
### Installing Postgres

#### Mac

* Install the Postrgres App by following this link:  https://postgresapp.com/
* Open the app (little blue elephant) and select initialize/start
* Type 'psql' into your terminal.

You should then see something similar to

    psql
    psql (9.6.5, server 9.6.6)
    Type "help" for help.

    username=#


if the above does not show/you get an error, run the following commands in your terminal:
- brew update
- brew doctor
- brew install postgresql

#### Ubuntu
Run this command in your terminal:

    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib


Next run the following commands to create a database user for Postgres.

    sudo -u postgres createuser --superuser $USER
    sudo -u postgres createdb $USER


Then run this command to enter the terminal application for PostgreSQL:
    
    psql

Now type the following template, but be sure to use your own username and create your own password (follow the instructions directly below the template to achieve this)

    ALTER USER username WITH PASSWORD 'mysecretword123';

In the above template, instead of username type your Ubuntu username and instead of 'mysecretword123' choose your own password and be sure to wrap it in quotation marks. Use a simple password like ‘password’. DONT USE YOUR LOGIN PASSWORD !

You can then exit out of psql by usin the command

    \q


Before testing or seeding, make sure you log into PostgreSQL using your login credentials (in your 'knexfile.js', add a 'username' and a 'password' key to each connection object in your custom config object; you do not need to do this if you are using a Mac)

## Seeding Your Database

Seed your development data by running the command 'npm run setup-dbs'. This will populate your new Postgres database, which you can then connect to by using the command:

    \c nc_news


If you have successfully connected, you will get a message that reads:

    `You are now connected to database "nc_news" as user ${your_username}`


Now that you are in your "nc_news" database, which should now be fully populated with your development data, run the SQL command:

    SELECT * FROM USERS;

You should now see a table of users (there should be 6, all with keys of 'name', 'username' and 'avatar_url').

Try out the same commands for each table you saw before in the project's migrations directory, or try out some varioutions to show different information.

If you're already familiar with SQL, try some more specific queries which involve referencing other tables (eg. the 'article_id' column in the 'comments' table references the 'article_id' column in the 'articles' table).
Get familiar with how the tables reference each other and then try some creative queries, for example showing all the comments related to a specific artile, including a column for each comment with an article title and topic.



## Running The Tests

    This project includes individual spec files for testing both the util functions and the app itself

### Testing The Util Functions
To run the utils.spec.js file, use the command

    npm run test-utils

Look at the utils.js file in the 'utils' directory; using the data found in the 'test_data' directory, familiarise yourself with how the the util functions manipulate the data during the seeding process (the input data is not in the format that PSQL will expect, meaning the fields may need new names, or be changed to a different kind of value entirely).

The tests will clearly outline what each method is attempting to achieve.

### Testing The App
To run the app.spec.js file, use the command

    npm run test

Look inside the app routers, controllers and models; pay close attention to what endpoint leads to which controllers and models, and how any data is manipulated and reformatted along the way (the seed.js file gives an idea of what order data must be seeded in order to achieve the correct format for any tables that reference other tables).

    If you look at the tests for POST `/api/articles/:article_id/comments` , you'll notice that the data expected to be given by clients follows a different format to the data in our seed files, meaning we will need to reformat the users request data before passing it through our own util functions, or else our tests will fail

## Deployment
    
    Follow the guide in the 'hosting.md' file found in this repository's Root Directory.

## Project Information

### Built With
VS Code
Node
JavaScript

### Versioning
We use GitHub for versioning. For the versions available, see the commits on this repository.

### Authors
Alastair Bowie
