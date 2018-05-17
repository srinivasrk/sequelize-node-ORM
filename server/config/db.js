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

db.Channel = require('../models/channels.js')(connection, Sequelize);
db.Site = require('../models/sites.js')(connection, Sequelize);
db.Maintainer = require('../models/maintainers.js')(connection, Sequelize);


// sites <-->> channels
db.Site.Channels = db.Site.hasMany(db.Channel, {as: 'channels'});
db.Channel.Site = db.Channel.belongsTo(db.Site, {as: 'site'});

// sites <<--> maintainers
db.Maintainer.Sites = db.Maintainer.hasMany(db.Site, {as: 'sites'});
db.Site.Maintainer = db.Site.belongsTo(db.Maintainer, {as: 'maintainer'});

module.exports = db;
