module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Batch', {
    name: { type: DataTypes.STRING }
  });
};
