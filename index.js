const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "schedular.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Ensure table creation happens only once (ideally during initial setup)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS mentor (
        mentor_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        availability TEXT NOT NULL,
        areas_of_expertise TEXT NOT NULL,
        is_premium INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS student (
        student_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        availability TEXT NOT NULL,
        area_of_interest TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS booking (
        booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        mentor_id INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        scheduled_time TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES student(student_id),
        FOREIGN KEY (mentor_id) REFERENCES mentor(mentor_id)
      );
    `);

    app.listen(process.env.PORT || 3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// **Error Handling in Endpoints:**
// Wrap each endpoint handler in a try-catch block to gracefully handle potential errors

// 1. Get All Mentors
app.get("/mentors", async (request, response) => {
  try {
    const getMentorsQuery = `
      SELECT
        *
      FROM
        mentor
      ORDER BY
        mentor_id;
    `;
    const mentorsArray = await db.all(getMentorsQuery);
    response.send(mentorsArray);
  } catch (error) {
    console.error("Error fetching mentors:", error.message);
    response.status(500).send("Internal Server Error"); // Send appropriate error code
  }
});

// 2. Get All Students
app.get("/bookings", async (request, response) => {
  try {
    const studentId = request.query.student_id; // Get the student ID from the query parameter

    const getBookingsQuery = `
      SELECT
        *
      FROM
        booking
      WHERE
        student_id = ?
      ORDER BY
        booking_id;
    `;
    const bookingsArray = await db.all(getBookingsQuery, [studentId]); // Replace '?' with the student ID
    response.send(bookingsArray);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// 3. Create a New Booking
app.post("/bookings", async (request, response) => {
  try {
    const { student_id, mentor_id, duration, scheduled_time } = request.body;

    // Validate input data (optional but recommended)
    if (!student_id || !mentor_id || !duration || !scheduled_time) {
      return response.status(400).send("Missing required booking details");
    }

    const createBookingQuery = `
      INSERT INTO
        booking (student_id, mentor_id, duration, scheduled_time)
      VALUES
        (${student_id}, ${mentor_id}, ${duration}, '${scheduled_time}');
    `;

    await db.run(createBookingQuery);
    response.send("Booking successfully created");
  } catch (error) {
    console.error("Error creating booking:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// 4. Schedule a Session with Back-to-Back Logic

app.post("/schedule-session", async (request, response) => {
  try {
    const {
      student_id,
      area_of_interest,
      duration,
      requested_time,
      is_premium,
    } = request.body;

    // Query to find an available mentor
    const getMentorQuery = `
      SELECT * FROM mentor
      WHERE areas_of_expertise LIKE '%${area_of_interest}%'
      AND availability = '${requested_time}'
      AND is_premium = ${is_premium ? 1 : 0}
      ORDER BY mentor_id
      LIMIT 1;
    `;

    const mentor = await db.get(getMentorQuery);

    if (!mentor) {
      return response
        .status(404)
        .send("No available mentors for the selected area of interest");
    }

    // Insert the booking
    const createBookingQuery = `
      INSERT INTO booking (student_id, mentor_id, duration, scheduled_time)
      VALUES (${student_id}, ${mentor.mentor_id}, ${duration}, '${requested_time}');
    `;

    await db.run(createBookingQuery);

    response.send("Booking successfully created with mentor " + mentor.name);
  } catch (error) {
    console.error("Error scheduling session:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

// 5. Calculate Payment
app.post("/calculate-payment", (request, response) => {
  const { duration, is_premium } = request.body;
  let cost = 0;

  switch (duration) {
    case 30:
      cost = 2000;
      break;
    case 45:
      cost = 3000;
      break;
    case 60:
      cost = 4000;
      break;
    default:
      cost = 2000;
  }

  if (is_premium) {
    cost += 1000; // Add premium charge
  }

  response.send({ cost });
});
