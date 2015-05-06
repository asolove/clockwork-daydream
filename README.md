# jirastats
Small node app that uses Jira's REST API to extract some useful statistics Jira's own reports lack.

## To Install
Clone this repo, then run
```
npm install
grunt
npm start
```
Open https://localhost:3000/ in a browser. SSL is supported out of the box--the app actually *only* listens via HTTPS--with a self signed certificate, included in the source. The key and cert can be overridden with a couple of ENV vars. You will need to provide your Jira host and login credentials on first use.

## How to Help
I've started capturing my thoughts on next steps in the issues, take a look there.
