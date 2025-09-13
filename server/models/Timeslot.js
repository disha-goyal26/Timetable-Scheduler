module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Timeslot', {
    day: { type: DataTypes.STRING },
    start_time: { type: DataTypes.STRING }, // "09:00"
    end_time: { type: DataTypes.STRING }
  });
};
