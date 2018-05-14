var Sequlize = require('sequelize');
const csv = require('convert-csv-to-json')
const csvFilePath = 'channels.csv'
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

csvActiveSites.forEach((element) => {
  var channels = {};

  //console.log(element);
  channels["site_name"] = element.site;
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





// the 3 nulls are IP user-name and password. Since this is sqlite those parameters are unset
var con = new Sequlize('null', 'null', 'null', {
  dialect: 'sqlite',
  storage: 'MSDDB.sqlite'
});

// Create sites table

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
}
);


// Create channels table here



var Channels = con.define('channels', {
  site_name: Sequlize.STRING,
  measurement: {
    type: Sequlize.ENUM,
    values: valuesEnumData,
    validate: {
      isIn: [valuesEnumData]
    }
  },
  units: {
    type: Sequlize.ENUM,
    values: unitsEnumData,
    validate: {
      isIn: [unitsEnumData]
    }
  },
  location: {
    type: Sequlize.ENUM,
    values: locationEnumData,
    validate: {
      isIn: [locationEnumData]
    }
  },
  method: {
    type: Sequlize.ENUM,
    values: methodEnumData,
    validate: {
      isIn: [methodEnumData]
    }
  },
  generator: {
    type: Sequlize.ENUM,
    values: generatorEnumData,
    validate: {
      isIn: [generatorEnumData]
    }
  },
  number: Sequlize.INTEGER
}, {
  timestamps: false,
  freezeTableName: true,
  tableName: 'channels'
});


Sites.hasMany(Channels, {
  foreignKey: 'site_name'
});


Sites.sync({
  force: true
}).then(() => {
  Sites.bulkCreate(
    bulkCreateSitesData
  ).then(() => {
    console.log("DONE");
    // build a site - id mapping here
    Sites.findAll().then((site) => {
      site.forEach((element) => {
        //  console.log(element.dataValues); // { id: 1472, site_name: 'TC-TM-028' }
        for (var i = 0; i < bulkCreateChannelsData.length; i++) {
          if (bulkCreateChannelsData[i]["site_name"] == element.dataValues.site_name) {
            bulkCreateChannelsData[i]["site_name"] = element.dataValues.id;
          }
        }
      })
      console.log(bulkCreateChannelsData);
      Channels.sync({
        force: true
      }).then(() => {
        Channels.bulkCreate(
          bulkCreateChannelsData
        ).then(() => {
          console.log("Finished inserting channels")
        })

        // Testing for failure worked : Cannot insert :SequelizeForeignKeyConstraintError: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
        // bulkCreateChannelsData[0].site_name = 9999;
        // Channels.create(bulkCreateChannelsData[0]).then(task => {
        //   console.log("Inserted")
        // }, (err) => {
        //   console.log("Cannot insert :" + err);
        // })
      })

    })

  });
});
