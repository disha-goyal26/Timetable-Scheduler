const express = require("express");
const router = express.Router();
const { TimetableEntry } = require("../models");

// Predefined timetable slots
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-01:00",
  "01:00-02:00",
  "02:00-03:00",
];

// 📌 Get all entries
router.get("/", async (req, res) => {
  const entries = await TimetableEntry.findAll();
  res.json(entries);
});

// 📌 Add new entry (auto-assign slot)
router.post("/", async (req, res) => {
  const { teacher, subject, batch, room } = req.body;

  // Find first free slot
  for (let d of days) {
    for (let s of slots) {
      const timeslot = `${d} ${s}`;
      const existing = await TimetableEntry.findOne({ where: { timeslot } });
      if (!existing) {
        // Save entry in the first available slot
        const newEntry = await TimetableEntry.create({
          teacher,
          subject,
          batch,
          room,
          timeslot,
        });
        return res.json(newEntry);
      }
    }
  }

  return res.json({ error: "No free slots available" });
});

// 📌 Reset timetable
router.delete("/reset", async (req, res) => {
  await TimetableEntry.destroy({ where: {} });
  res.json({ message: "Timetable reset" });
});

module.exports = router;
