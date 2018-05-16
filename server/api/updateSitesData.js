const db = require('../config/db');
const csv = require('convert-csv-to-json');
const updateSites = 'test_ac.csv';
let csvUpdateSites = csv.fieldDelimiter(',').getJsonFromCsv(updateSites);
var finalOp = {};
const _ = require("lodash");

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
        maintainer: site.maintainer ? site.maintainer.maintainer : "null"
      })
        // console.log(finalOp)
        /*
        { site_name: 'RR-02', is_active: 1, maintainer: 'ADS' }
        */
        //console.log(csvUpdateSites);
        /* { Site_ID: 'CSO-003',
        SelectedProject: 'CSO Monitoring',
        MaintenanceAssignedto: 'Stantec',
        Currentstatename: '2 - Site Opened\r' }, */

        // csvUpdateSites.forEach((element) => {
        //   if(! site_names.includes(element.Site_ID)) {
        //     console.log(element.Site_ID);
        //   }
        // })
    });
    var site_names = [];
    var maintainer_names = []
    resObj.forEach((element) => {
      site_names.push(element.site_name);
      maintainer_names.push(element.maintainer);
    })
    maintainer_names = _.uniq(maintainer_names);
    // site_names.push(finalOp.site_name);
    csvUpdateSites.forEach((element) => {
      if(!site_names.includes(element.Site_ID)){
        if(!maintainer_names.includes(element.MaintenanceAssignedto)){
          db.Maintainers.create({
            maintainer: element.MaintenanceAssignedto,
            sites: [{ site_name : element.Site_ID}]
          }, {
            include : [{
              model : db.Sites
            }]
          })
        } else {
          db.Maintainers.sync().then(() => {
            db.Maintainers.findOne({
              where : {
                maintainer : element.MaintenanceAssignedto
              }
            }).then((dbRow) => {
              console.log(dbRow);
              db.Sites.create({
                site_name: element.Site_ID,
                maintainer_id : dbRow.dataValues.id
              })
            })
          })
        }
      }
    })
  });
