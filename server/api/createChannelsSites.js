const db = require('../config/db');
const channelsData = require('./readCsvChannelsData');
var uniqueMaintainers = []

module.exports = function post(req,res,next) {
  return new Promise((resolve, reject) => {
    db.SiteMaintainers.sync({force:true});
    db.Sites.sync({
      force: true
    }).then(() => {
      db.Maintainers.sync({force:true}).then(() => {
          for(var site in channelsData){
            if(channelsData[site]["maintainer"][0])
            {
              if(! uniqueMaintainers.includes(channelsData[site]["maintainer"][0].maintainer)){
                console.log("true");
                db.Maintainers.create({
                  maintainer: channelsData[site]["maintainer"][0].maintainer
                });
                uniqueMaintainers.push(channelsData[site]["maintainer"][0].maintainer)
              }
            }
          }
      });
      db.Channels.sync({
        force: true
      }).then(() => {
        var promises = [];
        return db.connection.transaction().then(function(t) {
          for(var site in channelsData){
            promises.push(db.Sites.create({
                site_name: site,
                channels: channelsData[site]["channels"],
                is_active: channelsData[site]["is_active"]
              }, {
                include: [{
                  model : db.Channels
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
