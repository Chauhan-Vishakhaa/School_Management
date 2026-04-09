require('dotenv').config(); 

function validateAddSchool(req, res, next) {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'All fields are required: name, address, latitude, longitude' });
  }
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
  }
  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90' });
  }
  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Longitude must be between -180 and 180' });
  }

  next();
}

function validateListSchools(req, res, next) {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'latitude and longitude query params are required' });
  }
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
  }

  next();
}

module.exports = { validateAddSchool, validateListSchools };
