# dovecote

Installing
----


* Clone<br>
`git clone https://github.com/dashersw/dovecote.git`
* Install deps<br>
`npm install`
* Add some test data<br>
`npm run add-initial-data`<br>
email: test@dove-cote.co, password: asdf123


Development
-----------


Run `npm start` in root folder and `npm start` in frontend folder will
start servers at http://localhost:3001 (main backend server) and http://localhost:3000
(webpack server) respectively.

Access through http://localhost:3000 and it will proxy requests to backend if it cannot serve itself.

Production
----------
Generate the minified bundle using npm run fe_build. Then run `npm production_start`

```
npm run fe_build
npm production_start
```
