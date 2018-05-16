'use strict';

module.exports = (app, db) => {


  app.post('/file-upload', (req, res) => {
    console.log(req.files.file.name);
    res.end();
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
    db.Sites.findAll({
      include: [
        {
          model: db.Channels
        }
      ]
    }).then(sites => {
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



};
