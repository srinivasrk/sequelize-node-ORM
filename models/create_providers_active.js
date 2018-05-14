var Sequlize = require('sequelize');
const csv=require('convert-csv-to-json')
const csvFilePath='active_sites.csv'
let csvActiveSites = csv.fieldDelimiter(',').getJsonFromCsv(csvFilePath);
var _ = require('lodash');
var valuesEnumData = require('./values_enum_data');
var unitsEnumData = require('./units_enum_data');
var locationEnumData = require('./location_enum_data');
var methodEnumData = require('./method_enum_data');
var generatorEnumData = require('./generator_enum_data');
// Read JSON and create a object to be used
var bulkCreateActiveSitesData = [];



csvActiveSites.forEach((element) => {
  var isActive = {};

  //console.log(element);
  isActive["site_name"] = element.Site_ID;
  isActive["status"] = element.Currentstatename;
  //bulkCreate = bulkCreate.concat({element.site_id , element.generator, element.measurement, element.units, element.method, element.location, element.number})
  bulkCreateActiveSitesData = bulkCreateActiveSitesData.concat(isActive);

});
  console.log(bulkCreateActiveSitesData);

// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
var con = new Sequlize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'MSDDB.sqlite'
});

// Create is active attrbiute for Sites table in the model

var Sites = con.define('sites', {
  site_name: Sequlize.STRING,
  is_active: {
    type: Sequlize.INTEGER,
    defaultValue: 0
  }
}, {
   timestamps: false,
   freezeTableName: true,
   tableName: 'sites'
});



Sites.findAll().then((site) => {
  site.forEach((rowElement) => {
    bulkCreateActiveSitesData.forEach((element) => {
      if (element["site_name"] == rowElement.dataValues.site_name) {
        if(element["status"].substring(1,2) != "11" ){
          console.log(element["status"].substring(0,2));
          Sites.update({is_active : 1}, {where : {site_name: element["site_name"]}}).then(() => {
            console.log("Updated")
          });
        } else {
          Sites.update({is_active : 0}, {where: {site_name: element["site_name"]}}).then(() => {
            console.log("Updated")
          });
        }
      }
    })
  })
});
