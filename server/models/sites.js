const valuesEnumData = require('./enums/values_enum_data');
const unitsEnumData = require('./enums/units_enum_data');
const locationEnumData = require('./enums/location_enum_data');
const methodEnumData = require('./enums/method_enum_data');
const generatorEnumData = require('./enums/generator_enum_data');

module.exports = (connection, DataTypes) => {
  const Sites = connection.define('site', {
    site_name:{
      type : DataTypes.STRING,
      unique: true
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: false,
    underscored: true
  });

  return Sites;
};
