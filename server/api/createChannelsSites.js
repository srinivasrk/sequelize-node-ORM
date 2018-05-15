const db = require('../config/db');
const channelsData = require('./readCsvChannelsData');

module.exports = function post(req,res,next) {
  return new Promise((resolve, reject) => {
    db.Sites.sync({
      force: true
    }).then(() => {
      db.Maintainers.sync({force:true});
      db.Channels.sync({
        force: true
      }).then(() => {
        var promises = [];
        return db.connection.transaction().then(function(t) {
          for(var site in channelsData){
            promises.push(db.Sites.create({
                site_name: site,
                channels: channelsData[site]["channels"],
                maintainers: channelsData[site]["maintainer"],
                is_active: channelsData[site]["is_active"]
              }, {
                include: [{
                  model : db.Maintainers
                }, {
                  model: db.Channels
                }
              ],
                transaction: t
              }));
          }
          Promise.all(promises)
            .then(() => {
              t.commit()
              console.log("DONE")
              resolve("Completed");
            })

        })
    });
  });
})

}
