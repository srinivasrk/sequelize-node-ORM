const db = require('../config/db');
const channelsData = require('./readCsvChannelsData');

var getUniqueMaintainers = function(channelsData) {
  var uniqueMaintainersArr = [];
  for(site in channelsData){
    if(channelsData[site]["maintainer"].length){
      //console.log(channelsData[site]["maintainer"][0].maintainer);
      if(! uniqueMaintainersArr.includes(channelsData[site]["maintainer"][0].maintainer) ){

        uniqueMaintainersArr.push(channelsData[site]["maintainer"][0].maintainer)
      }
    }
  }
  return uniqueMaintainersArr;
}


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
            promises.push(db.Sites.create ({
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

              db.Maintainers.sync({force: true}).then(() => {
                  uniqueMaintainersArr = getUniqueMaintainers(channelsData);
                  uniqueMaintainersArr.forEach((element) => {
                    console.log("name :" + element)
                    db.Maintainers.create({
                      maintainer: element
                    }).then((row) => {
                      for(var site in channelsData){
                        if(channelsData[site]["maintainer"].length){
                          if(channelsData[site]["maintainer"][0].maintainer == row.dataValues.maintainer ){
                            db.Sites.update({
                              maintainer_id : row.dataValues.id
                            }, {
                              where : {
                                site_name : site
                              }
                            });
                        }
                      }
                    }
                    })
                  })
                })

            }).catch((err) => {
              console.log("Error" + err);
            })

        })
    });
  });
})

}
