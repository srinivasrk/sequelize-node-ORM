const Sequelize = require('sequelize');
// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
const connection = new Sequelize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'MSDDB.sqlite',
  //logging: false
});

const db = {}

db.Sequelize = Sequelize;
db.connection = connection;

db.Channels = require('../models/channels.js')(connection, Sequelize);
db.Sites = require('../models/sites.js')(connection, Sequelize);
db.Maintainers = require('../models/maintainers.js')(connection, Sequelize);
db.SiteMaintainers = require('../models/site_maintainers.js')(connection, Sequelize);



db.Sites.hasMany(db.Channels);
db.Sites.belongsToMany(db.Maintainers, {through : db.SiteMaintainers });

module.exports = db;
