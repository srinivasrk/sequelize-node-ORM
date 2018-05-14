
var rowChannelData = {};

const csv = require('convert-csv-to-json')
const csvFilePath = 'channels.csv'
let csvChannelsData = csv.fieldDelimiter(',').getJsonFromCsv(csvFilePath);
var _ = require('lodash');

csvChannelsData.forEach((element) => {
  var channel = {};
  channel["generator"] = element.generator;
  channel["measurement"] = element.measurement;
  channel["units"] = element.units;
  channel["method"] = element.method;
  channel["location"] = element.location;
  channel["number"] = element.number;

  if(rowChannelData[element.site]){
    rowChannelData[String(element.site)].channels.push(channel)
  } else {
    rowChannelData[String(element.site)] = {
      channels:[]
    };
    rowChannelData[String(element.site)].channels.push(channel);
  }

});

module.exports = rowChannelData;
