var Channels = require('../models/channels.js');
const csv = require('convert-csv-to-json');
const csvFilePath = 'channels.csv';
var channelsRowData = [];
const db = require('../config/db');
const channelsData = require('./readChannelsData');

var channels = {};
module.exports = function post(req,res,next) {
  return new Promise((resolve, reject) => {
    db.Sites.sync({
      force: true
    }).then(() => {
      db.Channels.sync({
        force: true
      }).then(() => {
        for(var site in channelsData){
          db.Sites.create({
            site_name: site,
            channels: channelsData[site]["channels"],
            maintainer: channelsData[site]["maintainer"][0],
            is_active: channelsData[site]["is_active"]
          }, {
            include: [db.Channels]
          })
        }
    });
  });
})

}
