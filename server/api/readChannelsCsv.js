const csv = require('convert-csv-to-json')
const csvFilePath = 'channels.csv'
let csvChannelsData = csv.fieldDelimiter(',').getJsonFromCsv(csvFilePath);
var _ = require('lodash');
var finalObject = [];
// Read JSON and create a object to be used
bulkCreateChannelsData = [];
bulkCreateSitesData = [];
var sites = []
const db = require('../config/db');

csvChannelsData.forEach((element) => {
  var channels = {};
  //console.log(element);
  channels["site"] = {"site_name" : element.site};
  channels["generator"] = element.generator;
  channels["measurement"] = element.measurement;
  channels["units"] = element.units;
  channels["method"] = element.method;
  channels["location"] = element.location;
  channels["number"] = element.number;



  //bulkCreate = bulkCreate.concat({element.site_id , element.generator, element.measurement, element.units, element.method, element.location, element.number})
  sites = sites.concat(channels["site_name"])
  sites.push(element.site)

  bulkCreateChannelsData = bulkCreateChannelsData.concat(channels);

});
var uniqueSites = (_.uniq(sites));
uniqueSites.forEach((element) => {
  var temp = {};
  temp["site_name"] = element;
  bulkCreateSitesData = bulkCreateSitesData.concat(temp)
});

finalObject["channelsData"] = bulkCreateChannelsData;
finalObject["sitesData"] = bulkCreateSitesData;

module.exports = finalObject;
