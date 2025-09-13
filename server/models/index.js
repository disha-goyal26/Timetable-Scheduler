const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

const Timeslot = require('./Timeslot')(sequelize, DataTypes);
const Teacher = require('./Teacher')(sequelize, DataTypes);
const Subject = require('./Subject')(sequelize, DataTypes);
const Room = require('./Room')(sequelize, DataTypes);
const Batch = require('./Batch')(sequelize, DataTypes);
const TimetableEntry = require('./TimetableEntry')(sequelize, DataTypes);

// Relations
Teacher.belongsToMany(Subject, { through: 'TeacherSubjects' });
Subject.belongsToMany(Teacher, { through: 'TeacherSubjects' });

TimetableEntry.belongsTo(Timeslot);
TimetableEntry.belongsTo(Teacher);
TimetableEntry.belongsTo(Subject);
TimetableEntry.belongsTo(Batch);
TimetableEntry.belongsTo(Room);

Timeslot.hasMany(TimetableEntry);
Teacher.hasMany(TimetableEntry);
Subject.hasMany(TimetableEntry);
Batch.hasMany(TimetableEntry);
Room.hasMany(TimetableEntry);

module.exports = {
  sequelize,
  Timeslot,
  Teacher,
  Subject,
  Room,
  Batch,
  TimetableEntry
};
