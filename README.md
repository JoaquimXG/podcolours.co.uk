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
Copy `.env.template` to `.env` and fill in the appropriate variables. Variables
included below.

The one `.env` serves both ways of running the site. Docker compose reads it
automatically for the containerised run, and dotenv reads it when running the
app directly on the host. Note that MONGOHOST and MONGOPORT differ between the
two - see the comments in `.env.template`.

`.env` is gitignored and nothing in it is built into the image, so the same
image can be deployed against any environment by varying only the variables
passed to it.

#### Mongo and App Configuration

- APPPORT
  - Port the app listens on
- MONGOHOST
  - Hostname for MongoDB server. Leave unset under docker compose, which
    reaches the mongo container as `mongo`
- MONGOPORT
  - Port to connect to MongoDB server. Leave unset under docker compose
- MONGODATABASE
  - MongoDB database name

The following are read by docker compose only and are not passed to the app.

- HOSTPORT
  - Port the site is published on, on the host
- BINDADDR
  - Host interface to publish on, `127.0.0.1` by default

#### Archive Mode

This site is published as a read-only public archive of previous work, so it
runs with `ARCHIVEMODE` enabled.

- ARCHIVEMODE
  - `true` (the default, including when the variable is unset) serves the site
    as an archive. `false` restores the fully working site.

With archive mode on:

- No cookies are set at all. Express sessions, the connect-mongo session store,
  cookie-parser and passport are simply not mounted, so `req.user` is always
  undefined and every route treats the visitor as logged out.
- Login, sign up and password reset answer with the "not signed in" response
  their forms already understand, plus an `archived` flag the frontend uses to
  explain that the feature is switched off. Nothing is written to the database
  and no email is sent.
- The legal page is not mounted and falls through to the 404 page, since the
  archive collects no personal data for a privacy policy to describe.
- A banner across the top of every page says the site is an archive.

The homepage and the personality test are unaffected - the test has always kept
its state in localStorage for signed-out visitors, so it works end to end.

Reverting to a fully working deployment is a case of setting `ARCHIVEMODE=false`.
The placeholder team photograph and the invented testimonial names are content
changes rather than toggles, and would need reverting separately.

#### Secrets

- SESSIONSECRET
  - Secret for encryption sessions
- SMTPSECRET (REQUIRED)
  - Password for relay SMTP server
- MONGOUSER
  - Username for authenticating to mongodb
- MONGOPASSWORD
  - Password for authenticating to mongodb
- AUTHSOURCE
  - MongoDB database where authenticating user is based

### Option 1 - Local MongoDB

This method should be utilised for development.

Dependancies:
    - node @18
    - npm @9
    - MongoDB @8.0 (and `mongosh`, which replaced the legacy `mongo` shell)

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

#### Mongo Security

If the local mongo installation has been set up with access controls then a
user has to be created with the appropriate permissions for the database which
is to be used.

Permissions required are, `readWrite` and `dbAdmin`.

The details for the user should then be added to the .env file under MONGOUSER,
MONGOPASSWORD and AUTHSOURCE.

### Option 2 - Docker

Allows for automated and reliable deployment of the site for CI/CD purposes.
Requires:
    - Docker
    - Docker-compose

Copy `.env.template` to `.env` and fill it in first. Compose picks `.env` up
automatically, so no `--env-file` flag is needed. MONGOUSER, MONGOPASSWORD and
SESSIONSECRET are required and compose will refuse to start without them.

Simply run `npm run docker`.
Both containers will be launched, database will be initialised and the site can
be reached at <http://127.0.0.1:8060>.

The app is published on the loopback interface by default so that a deployment
is not reachable from outside the host without a reverse proxy in front of it.
Set `BINDADDR=0.0.0.0` in `.env` if you need to reach it from another machine
during development.

The mongo container publishes no port at all. Use
`docker compose exec mongo mongosh -u "$MONGOUSER" -p "$MONGOPASSWORD"
--authenticationDatabase admin podcolours` to inspect the database.

The database within the MongoDB container will only initalise when run for the
first time. Its data lives in the named docker volume `mongoData`. If setupDb.js
is edited, that volume should be removed completely with
`docker compose down -v`. This will force the MongoDB container to
re-initialise the database using the updated setupDb.js script.

The mongo container is configured with access controls using MONGOUSER and
MONGOPASSWORD. A user is created with the provided credentials and the same
credentials are passed to the application container.

The app waits for mongo to report healthy before starting. Mongo's healthcheck
tests that the seed data is present rather than only that the server answers,
because the official image runs a temporary instance while executing
setupDb.js which would otherwise answer a plain ping and let the app start
against a half seeded database.

#### MongoDB version

The mongo image is pinned to 7.0 rather than 8.x. MongoDB 8.0+ refuses to start
on Linux kernel 6.19 and newer. See the comment at the top of
docker-compose.yml for what has to be true before moving back up.

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
