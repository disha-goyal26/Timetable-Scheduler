const express = require('express');
const router = express.Router();
const createSampleData = require('./sampleData');
const { Timeslot, Teacher, Subject, Batch, Room, TimetableEntry } = require('./models');
const { generateTimetable } = require('./scheduler');

router.use(express.json());

// sample data
router.post('/sampledata', async (req, res) => {
  try {
    await createSampleData();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// basic CRUD endpoints
async function addModel(req, res, Model) {
  try {
    const obj = await Model.create(req.body);
    res.json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

router.post('/teachers', (req, res) => addModel(req, res, Teacher));
router.get('/teachers', async (req, res) => res.json(await Teacher.findAll({ include: [Subject] })));

router.post('/subjects', (req, res) => addModel(req, res, Subject));
router.get('/subjects', async (req, res) => res.json(await Subject.findAll()));

router.post('/batches', (req, res) => addModel(req, res, Batch));
router.get('/batches', async (req, res) => res.json(await Batch.findAll()));

router.post('/rooms', (req, res) => addModel(req, res, Room));
router.get('/rooms', async (req, res) => res.json(await Room.findAll()));

router.post('/timeslots', (req, res) => addModel(req, res, Timeslot));
router.get('/timeslots', async (req, res) => res.json(await Timeslot.findAll()));

// teacher-subject map
router.post('/map-teacher-subject', async (req, res) => {
  try {
    const { teacherId, subjectId } = req.body;
    const teacher = await Teacher.findByPk(teacherId);
    const subject = await Subject.findByPk(subjectId);
    await teacher.addSubject(subject);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// generate timetable
router.post('/generate', async (req, res) => {
  try {
    const results = await generateTimetable();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// get timetable
router.get('/timetable', async (req, res) => {
  const entries = await TimetableEntry.findAll({ include: [Timeslot, Teacher, Subject, Batch, Room] });
  res.json(entries);
});

module.exports = router;
