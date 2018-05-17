'use strict';
const createChannelsSites = require('./api/createChannelsSites');

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
    db.Sites.findAll({
      include: [
        {
          model: db.Maintainers
        }
      ]
    }).then(sites => {
      const resObj = sites.map(site => {
        return Object.assign({},
        {
          site_name : site.site_name,
          is_active: site.is_active,
          maintainer: site.maintainer
        })
      });
      res.json(resObj);
    });
  });

  app.get('/channels', (req, res) => {
    db.Sites.findAll({include: [db.Channels]}).then(sites => {
      const resObj = sites.map(site => {
        return Object.assign({},
        {
          site_name: site.site_name,
          is_active: site.is_active,
          channel_list: site.channels
        })
      })
      res.json(resObj);
    })
  });


  app.get('/create-channles-sites', (req, res) => {
    createChannelsSites.updateSites()
    .then(() => createChannelsSites.updateChannels())
    .then(() => {
      console.log("FINISHED CHANNELS PROMISE")
    });
  })

};
