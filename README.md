# chordpro-editor
Simple chordpro editor

## setup

```
curl -sL https://rpm.nodesource.com/setup | bash -
yum install -y nodejs
npm install forever -g
cd /opt
git clone https://github.com/jimareed/<project>
cd <project>
npm install
forever start -o out.log server.js
forever stop server.js
```

## run tests

```
cd /opt/<project>
./node_modules/.bin/mocha tests
```
