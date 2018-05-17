'use strict';
const createChannelsSites = require('../../api/createChannelsSites');

module.exports = (app, db) => {
  app.post('/sites-file-upload', (req, res) => {
    if(! req.files)
      return res.status(400).send("No files were uplaoded");

    let inputFile  = req.files.file;

    inputFile.mv(`imports/my_upload.csv`, function(err) {
      if(err){
        console.log(err);
        return res.status(500).send(err)
      }
      res.send('File uploaded');
    });
  });

  app.get('/sites', (req, res) => {
    db.Site.findAll({
      include: [
        {
          model: db.Maintainer,
          as: 'maintainer'
        }
      ]
    }).then(sites => {
      const resObj = sites.map(site => {
        return Object.assign({},
        {
          site_name : site.name,
          active: site.active,
          maintainer: site.maintainer?site.maintainer.name: "NA"
        })
      });
      res.json(resObj);
    });
  });

  app.get('/channels', (req, res) => {
    db.Site.findAll({include:[{model: db.Channel, as:'channels'}]}).then(sites => {
      const resObj = sites.map(site => {
        return({
          site_name : site.name,
          active: site.active,
          channels: site.channels
        })
      })
      res.json(resObj);
    });

  });


  app.get('/create-channles-sites', (req, res) => {
    createChannelsSites.updateSites()
    .then(() => createChannelsSites.updateChannels())
    .then(() => {
      console.log("FINISHED CHANNELS PROMISE")
      res.end();
    }).catch((err) => {
      console.log(err);
      res.end();
    });
  })

};
