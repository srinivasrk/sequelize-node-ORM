module.exports = (connection, DataTypes) => {
  const Maintainers = connection.define('maintainers', {
    maintainer:{
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true
    },
  }, {
    timestamps: false,
    underscored: true
  });
  return Maintainers;
};
