const db = require('../config/db');
const bulkCreateSitesData = require('./readChannelsCsv')["sitesData"];
console.log(bulkCreateSitesData);

module.exports = function post(req,res,next) {
  return new Promise((resolve, reject) => {
    //Create sites table
    db.Sites.sync({
      force: true
    }).then(() => {
      db.Sites.bulkCreate(
        bulkCreateSitesData
      ).then(() => {
        resolve("Created Sites table");
      });
    });
  });
};
