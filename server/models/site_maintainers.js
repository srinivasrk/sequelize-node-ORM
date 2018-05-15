module.exports = (connection, DataTypes) => {
  const SiteMaintainers = connection.define('site_maintainers', {

  }, {
    timestamps: false,
    underscored: true
  });
  return SiteMaintainers;
};
