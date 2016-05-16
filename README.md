# chordpro-editor
Simple chordpro editor

## run tests

```
cd chordpro-editor
npm install
node server
./node_modules/.bin/mocha tests
```

## node.js setup

```
curl -sL https://rpm.nodesource.com/setup | bash -
yum install -y nodejs
npm install forever -g
cd /opt
git clone https://github.com/jimareed/<nodejs project>
cd <nodejs project>
npm install
forever start -o out.log server.js
forever stop server.js
```
