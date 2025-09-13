const { Timeslot, Teacher, Subject, Room, Batch, TimetableEntry } = require('./models');

function hmToMin(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h*60 + m;
}
const dayOrder = { Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6, Sun:7 };

async function generateTimetable() {
  // clear existing
  await TimetableEntry.destroy({ where: {} });

  const timeslots = await Timeslot.findAll();
  const batches = await Batch.findAll();
  const subjects = await Subject.findAll();
  const teachers = await Teacher.findAll();
  const rooms = await Room.findAll();

  // precompute subject -> teachers
  const subjToTeachers = {};
  for (const s of await Subject.findAll()) {
    const ts = await s.getTeachers();
    subjToTeachers[s.id] = ts;
  }

  // sort timeslots
  timeslots.sort((a,b) => {
    const d = (dayOrder[a.day]||0) - (dayOrder[b.day]||0);
    if (d !== 0) return d;
    return hmToMin(a.start_time) - hmToMin(b.start_time);
  });

  const assigned = {}; // per timeslot id
  const batchIndex = {};
  for (const b of batches) batchIndex[b.id] = 0;

  for (const ts of timeslots) {
    assigned[ts.id] = { teachers: new Set(), rooms: new Set(), batches: new Set() };

    for (const b of batches) {
      if (subjects.length === 0) continue;
      const subj = subjects[ batchIndex[b.id] % subjects.length ];
      const candidates = subjToTeachers[subj.id] || [];
      const teacher = candidates.find(t => !assigned[ts.id].teachers.has(t.id));
      const room = rooms.find(r => !assigned[ts.id].rooms.has(r.id));

      if (!assigned[ts.id].batches.has(b.id) && teacher && room) {
        await TimetableEntry.create({
          TimeslotId: ts.id,
          TeacherId: teacher.id,
          SubjectId: subj.id,
          BatchId: b.id,
          RoomId: room.id
        });

        assigned[ts.id].teachers.add(teacher.id);
        assigned[ts.id].rooms.add(room.id);
        assigned[ts.id].batches.add(b.id);
      }

      batchIndex[b.id] = batchIndex[b.id] + 1;
    }
  }

  const full = await TimetableEntry.findAll({ include: [Timeslot, Teacher, Subject, Batch, Room] });
  return full;
}

module.exports = { generateTimetable };
