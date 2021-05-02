# POD Colours

POD Colours is a unique personality evaluation test.
The POD Colours tool supports individuals and teams to appreciate differences in
personality by en-hancing self-awareness, leading to a deeper understanding of
oneself and other people.
The POD Colours tool is based on psychological research, and provides an
indication of your key strengths and potential barriers to success.

## Usage

Two options for using the site.

1. Locally with local MongoDB installation.
2. Through a pair of docker containers. One running MongoDB and one for the webapp.

### Configuration

Server is configured through environment variables, either manually set or through
dotenv.
If using dotenv, fill in the appropriate variables in a .env file. Variables
included below.

- APPPORT
  - Port for connecting to website
- MONGOHOST
  - Hostname for MongoDB server
- MONGOPORT
  - Port to connect to MongoDB server
- MONGODATABASE
  - MongoDB database name
- SESSIONSECRET
  - Secret for encryption sessions

### Option 1 - Local MongoDB

This method should be utilised for development.

Requires:
    - Node
    - npm
    - MongoDB @3.2+

Website backend is built with express, ejs and MongoDB and npm has been configured
with a selection of setup scripts to ease development.

To start webapp.

1. Install required npm packages, `npm install`.
2. Setup the podcolours MongoDB database, `npm run setupDb`
3. Launch webapp `npm start`.

The webapp can additionally be launched with hot reload with `npm run devel` to
ease development.

#### Development and Testing

run `npm run devel` to run the site with hot reload for development.

### Option 2 - Docker

This will be the way to deploy when we actually deploy to production, unfortunately
the codio virtual machines don't allow docker to be installed and run.

Allows for automated and reliable deployment of the site for CI/CD purposes.
Requires:
    - Docker
    - Docker-compose

Simply run `npm run docker`.
Both containers will be launched, database will be initialised and the site can
be reached at localhost:8080.

The database within the MongoDB container will only initalise when run for the
first time. If setupDb.js is edited, the data/ folder should be deleted completely.
This will force the MongoDB container to re-initialise the database using the updated
setupDb.js script.

#### Issues

If a local MongoDB instance is already running on port 27017 (default port), it will
need to be stopped before the docker instance can run.

## Home page

Serves as the landing page for the site. Functionality includes; 'Login'
button to promt user input (Email address and Password), 'Take the test'
button to direct user to app.html and begin the personality test.
Also includes general information about POD Colours.

## Personality test page

Allows the user to drag and drop personality statement cards into either a red
or green 'dropzone'. Once all the cards on screen have been dragged into the
appropriate section a new set of cards will appear. This process will be repeated
until all the cards have been sorted into sections.
At the end of the test the user will be greeted with a pop up that states which
colour they have been grouped into. The text indicating what colour they are will
change automatically and display some brief information on their type of personality
result. They will also have the option to 'suggest a movie'. This function will
incorporate the use of the IMDB movie database to search for relative genres that
are based on the personality result.
