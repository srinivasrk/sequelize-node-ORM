module.exports = (connection, DataTypes) => {
  const Maintainers = connection.define('maintainers', {
    maintainer:{
      type: DataTypes.STRING,
      unique: true
    },
  }, {
    timestamps: false,
    underscored: true
  });
  return Maintainers;
};
