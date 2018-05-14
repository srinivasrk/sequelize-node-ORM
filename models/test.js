var Sequlize = require('sequelize');

// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
var con = new Sequlize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'test.sqlite'
});

//Creating a table - call it as test_table
var Article = con.define('test_table', {
  title: Sequlize.STRING,
  body: Sequlize.TEXT
});

con.sync().then(function() {
  Article.create({
    title: 'my data',
    body: 'some text here'
  });
});

con.sync().then(function() {
  Article.findAll().then(function(articles) {
    console.log("Total records :" + articles.length);
  })
})
