module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Teacher', {
    name: { type: DataTypes.STRING }
  });
};
