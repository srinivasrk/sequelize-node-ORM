const valuesEnumData = require('./enums/values_enum_data');
const unitsEnumData = require('./enums/units_enum_data');
const locationEnumData = require('./enums/location_enum_data');
const methodEnumData = require('./enums/method_enum_data');
const generatorEnumData = require('./enums/generator_enum_data');

module.exports = (connection, DataTypes) => {
  const Channels = connection.define('channels', {
    measurement: {
      type: DataTypes.ENUM,
      values: valuesEnumData,
      // validate: {
      //   isIn: [valuesEnumData]
      // }
    },
    units: {
      type: DataTypes.ENUM,
      values: unitsEnumData,
      // validate: {
      //   isIn: [unitsEnumData]
      // }
    },
    location: {
      type: DataTypes.ENUM,
      values: locationEnumData,
      // validate: {
      //   isIn: [locationEnumData]
      // }
    },
    method: {
      type: DataTypes.ENUM,
      values: methodEnumData,
      // validate: {
      //   isIn: [methodEnumData]
      // }
    },
    generator: {
      type: DataTypes.ENUM,
      values: generatorEnumData,
      // validate: {
      //   isIn: [generatorEnumData]
      // }
    },
    number: DataTypes.INTEGER
  }, {
    timestamps: false,
    underscored: true
  });

  return Channels;
};
