const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://PreviousExpress:demo@cluster0-pvajw.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "palindrome";

app.listen(8000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('check').find().toArray((err, result) => {
    console.log(result)
    if (err) return console.log(err)
    res.render('index.ejs', {word: result})

  })
})

app.post('/palindrome', (req, res) => {
  let word = req.body.word
  let checkPalindrome = word.split('').reverse().join('')
  let palindromeOrNah = false;
  if(word === checkPalindrome) {
    palindromeOrNah = true;
  }
  db.collection('check').save({word: req.body.word, palindromeOrNah: palindromeOrNah}, (err, result) => {
    if (err) return console.log(err)
    console.log(result)
    res.redirect('/')

  })



  console.log(word)
})

app.put('/palindrome', (req, res) => {
  db.collection('check')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/palindrome', (req, res) => {
  console.table(req.body)
  let word = req.body.word
  let checkPalindrome = word.split('').reverse().join('')
  db.collection('check').findOneAndDelete({word: req.body.word, palindromeOrNah: palindromeOrNah}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
