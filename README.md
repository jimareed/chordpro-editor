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

```
curl -sL https://rpm.nodesource.com/setup | bash -
yum install -y nodejs
npm install forever -g
cd /opt
git clone https://github.com/jimareed/chordpro-editor
cd chordpro-editor
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

## install docker
```
sudo yum install -y docker
sudo service docker start
```

## build and run
```
docker build -t chordpro-editor-image .
docker run -p 3000:3000 -d --name chordpro-editor chordpro-editor-image
```

## cleanup
```
docker stop chordpro-editor
docker rm chordpro-editor
```
