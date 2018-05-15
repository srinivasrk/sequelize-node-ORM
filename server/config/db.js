const Sequelize = require('sequelize');
// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
const connection = new Sequelize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'MSDDB.sqlite',
  logging: false
});

const db = {}

db.Sequelize = Sequelize;
db.connection = connection;

db.Channels = require('../models/channels.js')(connection, Sequelize);
db.Sites = require('../models/sites.js')(connection, Sequelize);


db.Sites.hasMany(db.Channels);

// `{
//   include: [{
//     association: db.Channels.belongsTo(db.Sites),
//     include : [db.Sites.hasMany(db.Channels)]
//   }]
// }`;

module.exports = db;
