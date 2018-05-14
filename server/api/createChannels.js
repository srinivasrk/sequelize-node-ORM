var Channels = require('../models/channels.js');
const bulkCreateChannelsData = require('./readChannelsCsv')["channelsData"];
const db = require('../config/db');
console.log(bulkCreateChannelsData)
module.exports = function post(req,res,next) {
  return new Promise((resolve, reject) => {
    db.Channels.sync({
      force: true
    }).then(() => {
      db.Channels.bulkCreate({
        
      }).then(() => {
        resolve("DONE creating channels table")
      })
    });
  });
}
