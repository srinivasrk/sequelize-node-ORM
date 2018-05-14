var Sequlize = require('sequelize');
const csv=require('convert-csv-to-json')
const csvFilePath='channels.csv'
let csvActiveSites = csv.fieldDelimiter(',').getJsonFromCsv(csvFilePath);
var _ = require('lodash');
var valuesEnumData = require('./values_enum_data');
var unitsEnumData = require('./units_enum_data');
var locationEnumData = require('./location_enum_data');
var methodEnumData = require('./method_enum_data');
var generatorEnumData = require('./generator_enum_data');
// Read JSON and create a object to be used
bulkCreateChannelsData = [];
bulkCreateSitesData = [];
var sites = []


// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
var con = new Sequlize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'MSDDB.sqlite'
});

// Create sites model

var Sites = con.define('sites', {
  site_name: Sequlize.STRING
}, {
   timestamps: false,
   freezeTableName: true,
   tableName: 'sites'
});

// Query to get all sites
Sites.findAll().then((site) => {
  site.forEach((element) => {
    console.log(element.dataValues); // { id: 1472, site_name: 'TC-TM-028' }
  })
})
