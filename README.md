# NC-News
## What Is NC-News?
NC-News is an API written in JavaScript that contains various endpoints, displaying articles, comments and topics depending on the path, as well as queries. It utilises Express, Knex and SQL as dependencies, and was tested using Supertest, Mocha and Chai as dev-dependencies.

* The NC-News app is currently hosted at: http://bowie-nc-news.herokuapp.com/api/ 
---------------------------------------------------------------------------------------------------------------


## Getting Started
Fork the project and clone it into your teminal using 

    git clone <HTTPS>

Make sure to install Supertest, Mocha and Chai as dev-dependencies

    npm install -D mocha chai supertest

Make sure to install PG, Knex and Express as dependencies

    npm install pg knex express


The package.json file contains a full list of 'npm run' commands; the first one you'll need will be 'npm run setup-dbs', which will be outlined more specifically later in this guide.

Have a look through the migration directory for the database schemas, which currently includes Articles, Comments, Topics, Users (There are individual data folders for the testing and development environments, which are already set in the project - Have a look inside the 'knexfile.js' and 'connection.js' files to see how the environment is set using a dbConfig exported object).

---------------------------------------------------------------------------------------------------------------

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

    brew update
    brew doctor
    brew install postgresql

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

---------------------------------------------------------------------------------------------------------------

## Creating Your Knexfile

The knexfile.js will hold all the information about our database connections , which will use process environment information to determine which database we should connect to.

We will now complete this file by following these instructions!

### Create a file called
    
    knexfile.js

At the top of this file, we will create a variable which will declare which environment on which we will run the app (we will have development, test and later a production environment - but for now, we'll just create the test and development environments).

Enter the following line of code at the top of your knexfile.js

    const ENV = process.env.NODE_ENV || 'development';


This will set the ENV variable to whatever environment is determined by 'process.env.NODE_ENV', or it will default to 'development'.

### Creating A Config Object

Create the following variable in knexfile.js

    const baseConfig = {
        client: 'pg',
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
         directory: './db/seeds'
        }
        };

This will connect you to your migrations and seeds directories, and determine your client.

Now create the following 'customConfig' object; this will determine which database we are connecting to based on the ENV variable (when we are in the development environment, we will connect to the nc_news database, however if we are in the test environment, we will connect to the nc_news_test database. That way we can test our app without affecting our actual data)

    const customConfig = {
        development: {
            connection: {
                database: 'nc_news'
            }
        },
        test: {
            connection: {
                 database: 'nc_news_test'
            }
        }
    };

Finally, we will export our environment objects using the following line at the bottom of the knexfile

    module.exports = { ...customConfig[ENV], ...baseConfig };

Due to the spread operator (...), all the keys in customConfig are pushed into an array, however by deconstructing the [ENV] from the array, we only export the connection that is relevent to the environment we are in.

The spread operator also exports all the keys from our baseConfig object.

---------------------------------------------------------------------------------------------------------------

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

---------------------------------------------------------------------------------------------------------------


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

---------------------------------------------------------------------------------------------------------------

## Hosting The App

There are many ways to host applications like the one you have created. One of these solutions is Heroku. Heroku provides a service that you can push your code to and it will build, run and host it. Heroku also allows for easy database integration. Their [documentation](https://devcenter.heroku.com/articles/getting-started-with-nodejs) is excellent, so take a look at that. This document is essentially a more condensed, specific version of the steps described in the Heroku docs.

### 1. Install the Heroku CLI

On macOS:

    brew tap heroku/brew && brew install heroku

On Ubuntu:

    sudo snap install --classic heroku

### 2. Create a Heroku App

Log into Heroku using the following command in their command line interface

    heroku login

Create an app in an active git directory. Doing this in the folder where your server exists is a good start, as this is what you will be hosting.
Use the following command


    heroku create your-app-name


Here `your-app-name` should be the name you want to give your application. If you don't specify an app name, you'll get a random one which can sometimes be a bit iffy.

This command will both create an app on Heroku for your account. It will also add a new `remote` to your git repository.
Check this by looking at your git remotes using the following command

    git remote -v


### 3. Push Your code up to Heroku
Use the following command to push your code up to Heroku

    git push heroku master


### 4. Creating a Hosted Database

Go to the heroku site and log in.

- Select your application
- `Configure Add-ons`
- Choose `Heroku Postgres`

The free tier will be adequate for our purposes. This will provide you with a `postgreSQL` pre-created database!

Check that the database exists. Click `settings` on it, and view the credentials. Keep an eye on the URI. Don't close this yet!

### 5. Seeding the Production Database

Check that your database's url is added to the environment variables on Heroku:

```bash
heroku config:get DATABASE_URL
```

If you are in your app's directory, and the database is correctly linked as an add on to Heroku, it should display a DB URI string that is exactly the same as the one in your credentials.

At the top of your `knexfile.js`, add the following line of code:

```js
const { DB_URL } = process.env;
```

Then add a `production` key to the `customConfigs` object:

```js
const { DB_URL } = process.env;
// ...
const customConfigs = {
  // ...
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};
// ...
```

It is critical to add the query of `ssl=true`, otherwise this will not work!

In your `./db/data/index.js` add a key of production with a value of your development data in your data object. Something like:

```js
const data = { test, development, production: development };
```

This is will ensure your production DB will get seeded with the development data.

In your `package.json`, add the following keys to the scripts:

```json
{
  "scripts": {
    "seed:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex seed:run",
    "migrate-latest:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest",
    "migrate-rollback:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:rollback"
  }
}
```

Each of these will establish an environment variable called `DB_URL`, and set it to whatever heroku provides as your DB URL. It is essential that you do this as the DB URL may change! This deals with a lack of predictability on heroku's end.

Make sure to **run the seed prod script** from your `package.json`:

```bash
npm run seed:prod
```

### 6. Connect To The Hosted Database when on Heroku

Change your connection file to look something like this:

```js
const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');

const dbConfig =
  ENV === 'production'
    ? { client: 'pg', connection: process.env.DATABASE_URL }
    : require('../knexfile');

module.exports = knex(dbConfig);
```

It should check whether you're in production, and if you are, it should connect to the production database. Otherwise it will connect to the (`.gitignore`'d) knex file.

### 7. Use Heroku's PORT

In `listen.js`, make sure you take the PORT off the environment object if it's provided, like so:


    const { PORT = 9090 } = process.env;

    app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
    ```

### 8. Add a start script

Make sure your package.json has this as a start script


    "start": "node listen.js",


Commit your changes, and push to heroku master using the following command

    git push heroku master

### 9. Review Your App
Use the following command

    heroku open


Any issues should be debugged with the following command

    heroku logs --tail


---------------------------------------------------------------------------------------------------------------
## Project Information

### Built With
    VS Code
    Node
    JavaScript

### Versioning
    We use GitHub for versioning. For the versions available, see the commits on this repository.

### Authors
    Alastair Bowie
---------------------------------------------------------------------------------------------------------------

