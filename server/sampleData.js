const { Teacher, Subject, Batch, Room, Timeslot } = require('./models');

async function createSampleData() {
  // clean existing
  // (you can also remove DB file if you want a fresh start)
  // create subjects
  const math = await Subject.create({ name: 'Mathematics' });
  const phy = await Subject.create({ name: 'Physics' });
  const chem = await Subject.create({ name: 'Chemistry' });
  const eng = await Subject.create({ name: 'English' });

  // teachers
  const t1 = await Teacher.create({ name: 'Alice' });
  const t2 = await Teacher.create({ name: 'Bob' });
  const t3 = await Teacher.create({ name: 'Carol' });

  // map teachers to subjects
  await t1.addSubject(math);
  await t1.addSubject(eng);
  await t2.addSubject(phy);
  await t2.addSubject(chem);
  await t3.addSubject(chem);
  await t3.addSubject(math);

  // batches
  await Batch.create({ name: 'Batch A' });
  await Batch.create({ name: 'Batch B' });

  // rooms
  await Room.create({ name: 'Room 101' });
  await Room.create({ name: 'Room 102' });

  // timeslots (Mon-Fri, two slots per day)
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  for (const d of days) {
    await Timeslot.create({ day: d, start_time: '09:00', end_time: '10:00' });
    await Timeslot.create({ day: d, start_time: '10:00', end_time: '11:00' });
  }

  return { ok: true };
}

module.exports = createSampleData;
