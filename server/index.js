const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Days & Slots (fixed timetable structure)
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const slots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-01:00",
  "01:00-02:00",
  "02:00-03:00"
];

// Timetable entries
let timetable = [];

/**
 * GET - Fetch all timetable entries
 */
app.get("/api/timetable", (req, res) => {
  res.json(timetable);
});

/**
 * POST - Add a timetable entry
 * Expects: { teacher, subject, batch, room, day, slot }
 */
app.post("/api/timetable", (req, res) => {
  const { teacher, subject, batch, room, day, slot } = req.body;

  // Validate day & slot
  if (!days.includes(day) || !slots.includes(slot)) {
    return res.status(400).json({ error: "Invalid day or slot" });
  }

  const timeslot = `${day} ${slot}`;

  // Check for clash
  const conflict = timetable.find(t => t.timeslot === timeslot);
  if (conflict) {
    return res.status(400).json({ error: "Slot already booked" });
  }

  const newEntry = { teacher, subject, batch, room, timeslot };
  timetable.push(newEntry);
  res.json(newEntry);
});

/**
 * POST - Auto-schedule a class
 * Expects: { teacher, subject, batch, room }
 * Finds the next free slot automatically
 */
// Auto-schedule endpoint
app.post("/api/auto-schedule", (req, res) => {
  const { teacher, subject, batch, room, day } = req.body;

  const slots = [
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-01:00",
    "01:00-02:00",
    "02:00-03:00",
  ];

  // Try each slot for the given day
  for (let slot of slots) {
    const fullSlot = `${day} ${slot}`;

    const clash = timetable.some(
      (t) =>
        t.timeslot === fullSlot &&
        (t.teacher === teacher || t.room === room || t.batch === batch)
    );

    if (!clash) {
      const newEntry = { teacher, subject, batch, room, timeslot: fullSlot };
      timetable.push(newEntry);
      return res.json(newEntry);
    }
  }

  res.json({ error: "No free slots available for this day!" });
});


/**
 * RESET - Clear timetable (optional, for demo purposes)
 */
app.delete("/api/reset", (req, res) => {
  timetable = [];
  res.json({ message: "Timetable cleared" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
