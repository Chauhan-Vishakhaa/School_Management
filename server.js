require('dotenv').config(); 
const express = require('express');
const db = require('./db');
const cors = require('cors')
const { validateAddSchool, validateListSchools } = require('./middleware/validate');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(express.json());
// Haversine formula 
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
app.post('/addSchool',validateAddSchool, async (req, res) => {
  const { name, address, latitude, longitude } = req.body;
 
  try {
    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
 
    res.status(201).json({
      message: 'School added successfully',
      schoolId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
 

app.get('/listSchools',validateListSchools, async (req, res) => {
  const { latitude, longitude } = req.query;
 
  try {
    const [schools] = await db.execute('SELECT * FROM schools');
 
    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          getDistance(parseFloat(latitude), parseFloat(longitude), school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);
 
    res.status(200).json(sorted);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});
 



app.listen(PORT, ()=> {
    console.log("Server is Running")
});
