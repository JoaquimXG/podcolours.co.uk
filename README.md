# POD Colours

[![Work in Repl.it](https://classroom.github.com/assets/work-in-replit-14baed9a392b3a25080506f3b7b6d57f295ec2978f6f33ec97e36a161684cbe9.svg)](https://classroom.github.com/online_ide?assignment_repo_id=301411&assignment_repo_type=GroupAssignmentRepo)

POD Colours is a unique personality evaluation test.
The POD Colours tool supports individuals and teams to appreciate differences in
personality by en-hancing self-awareness, leading to a deeper understanding of
oneself and other people.
The POD Colours tool is based on psychological research, and provides an
indication of your key strengths and potential barriers to success.

## Dependancies

- MongoDB
  - Must be installed and available on the PATH

## Usage

Website backend is built with express, ejs and MongoDB.

npm has been configured to run a database setup script `setupDb.js` post
installation.
This will cause an error if mongodb is not currently installed and the service
is available on the default mongodb port.

1. First install required packages, `npm install`.
2. Then start server.js `npm start`.

### Development and Testing

run `npm test` to run the site with hot reload for development.

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

## Contributors

- Joaquim Gomez
- Euan Doyle
- Lewis Boyd
