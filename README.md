# chordpro-editor
Simple chordpro editor

![Basic Chordpro Editor](images/screenshot-main.png)
![Edit Chordpro](images/screenshot-edit-chordpro.png)
![Edit Chords](images/screenshot-edit-chord.png)

## run
```
docker run -p 3000:3000 -d --name chordpro-editor jimareed/chordpro-editor
```
> browse to http://localhost:3000

## cleanup
```
docker stop chordpro-editor
docker rm chordpro-editor
```

## configure mongo

replace the following line in db.js with the mongo connection string (e.g., mongodb://localhost/chordpro)
```
mongoose.connect('__mongo_connection_string__',function() {
  ```

## verify setup

```
cd /opt/chordpro-editor
./node_modules/.bin/mocha tests
```
