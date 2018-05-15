const csv = require('convert-csv-to-json');
const channelsCsvFile = 'channels.csv';
const activeSitesCsvFile = 'active_sites.csv';
let csvChannelsData = csv.fieldDelimiter(',').getJsonFromCsv(channelsCsvFile);
let csvActiveSitesData = csv.fieldDelimiter(',').getJsonFromCsv(activeSitesCsvFile);
var _ = require('lodash');
var rowChannelData = {};

csvChannelsData.forEach((element) => {
  var channel = {};
  channel["generator"] = element.generator.trim().toLowerCase();
  channel["measurement"] = element.measurement.trim().toLowerCase();
  channel["units"] = element.units.trim().toLowerCase();
  channel["method"] = element.method.trim().toLowerCase();
  channel["location"] = element.location.trim().toLowerCase();
  channel["number"] = element.number.trim().toLowerCase();

  if(rowChannelData[element.site.trim()]){
    rowChannelData[(element.site.trim())].channels.push(channel)
  } else {
    rowChannelData[(element.site.trim())] = {
      channels:[],
      maintainer:[]
    };
    rowChannelData[(element.site.trim())].channels.push(channel);
  }

});

csvActiveSitesData.forEach((element) => {
  if(rowChannelData[element.Site_ID.trim()]){
    rowChannelData[(element.Site_ID.trim())].maintainer.push({"maintainer" : element.MaintenanceAssignedto});
    if(element["Currentstatename"].substring(1,2) != "11" ){
      rowChannelData[(element.Site_ID.trim())]["is_active"] = 1
    } else {
      rowChannelData[(element.Site_ID.trim())]["is_active"] = 0;
    }
  } else {
    rowChannelData[(element.Site_ID.trim())] = {
      channels: [],
      maintainer: []
    };
    rowChannelData[(element.Site_ID.trim())].maintainer.push({"maintainer" : element.MaintenanceAssignedto});
    if(element["Currentstatename"].substring(1,2) != "11" ){
      rowChannelData[(element.Site_ID.trim())]["is_active"] = 1
    } else {
      rowChannelData[(element.Site_ID.trim())]["is_active"] = 0;
    }
  }
})

// console.log(rowChannelData);

module.exports = rowChannelData;
