var Channels = require('../models/channels.js');
const csv = require('convert-csv-to-json');
const csvFilePath = 'channels.csv';
//let csvChannelsData = csv.fieldDelimiter(',').getJsonFromCsv(csvFilePath);
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
        console.log(channelsData["TC-TM-028"]["channels"])
        for(var site in channelsData){
          db.Sites.create({
            site_name: site,
            channels: channelsData[site]["channels"]
          }, {
            include: [db.Channels]
          })
        }
    });
  });
})

}
