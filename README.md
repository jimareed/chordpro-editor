# chordpro-editor
Simple chordpro editor

![Basic Chordpro Editor](images/screenshot-main.png)
![Edit Chordpro](images/screenshot-edit-chordpro.png)
![Edit Chords](images/screenshot-edit-chord.png)


## setup

```
install project
configure mongo
start service
verify setup
```

## install project

{project}=chordpro-editor
```
curl -sL https://rpm.nodesource.com/setup | bash -
yum install -y nodejs
npm install forever -g
cd /opt
git clone https://github.com/jimareed/{project}
cd {project}
npm install
```
## configure mongo

replace the following line in db.js with the mongo connection string (e.g., mongodb://localhost/chordpro)
```
mongoose.connect('__mongo_connection_string__',function() {
  ```

## start service

```
forever start -o out.log server.js
forever stop server.js
```

## verify setup

```
cd /opt/{project}
./node_modules/.bin/mocha tests
```

## build and run
```
docker build . -t chordpro-editor-image
docker run -p 80:80 -d --name chordpro-editor chordpro-editor-image
```

## cleanup
```
docker stop chordpro-editor
docker rm chordpro-editor
```
