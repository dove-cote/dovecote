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


Configuration
--------------
* DOCKER_CERT_DIR<br>
In order to connect secure docker machines, you must set the environment variable `DOCKER_CERT_DIR` as your folder path of the credentials `ca.pem, cert.pem, key.pem`.
* DOCKER_NODE_VERSION<br>
By default dovecote comes with `node 4.2.2`. You can set other versions by changing `DOCKER_NODE_VERSION`.


Development
-----------


Run `npm start` in root folder and `npm start` in frontend folder will
start servers at http://localhost:3001 (main backend server) and http://localhost:3000
(webpack server) respectively.

Access through http://localhost:3000 and it will proxy requests to backend if it cannot serve itself.

Production
----------
Generate the minified bundle using npm run fe_build. Then run `npm run production_start`

```
npm run fe_build
npm production_start
```
