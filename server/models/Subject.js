module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Subject', {
    name: { type: DataTypes.STRING }
  });
};
