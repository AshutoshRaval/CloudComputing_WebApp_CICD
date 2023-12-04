const express = require('express');
const bodyParser = require('body-parser'); 
// const { checkHealth, healthz } = require('./Controller/healthController');
const sequelize = require('./Models/db');
const loadUsersFromCSV = require('./Utils/csvLoaders');
const processUsers = require('./Utils/processUsers');
const Users = require('./Models/UserOLD');
const User = require('./Models/User');
const Assignment = require('./Models/Assignment');
const basicAuth = require('./Middleware/basicAuth');  
const { createAssignment } = require('./Controller/assignmentController');
const { getAssignmentById } = require('./Controller/getAssignmentById');
const { getAllAssignments } = require('./Controller/getAllAssignments');
const { deleteAssignmentById } = require('./Controller/deleteAssignmentById');
const { updateAssignmentById } = require('./Controller/updateAssignmentById');
const { createSubmission } = require('./Controller/submissionController')
const logger = require('./Utils/logger');
const statsd = require('./Utils/statsdClient');
// const { checkAssignmentapi } = require('./Controller/checkAssignmentapi')


const app = express();
const PORT = 8080;

app.use(bodyParser.json()); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Below API create the assignment
app.post('/v1/assignment', basicAuth, createAssignment);

//Below API Gets the assignment based on the ID or fecthes all the assignment
app.get('/v1/assignment', basicAuth, (req, res, next) => {
// app.get('v1/assignment/', basicAuth, (req, res, next) => {
      console.log('by Id')
      logger.info(`Fetching assignment by ID: ${req.query.id}`);
      statsd.increment('endpoint.hits.v1.assignment.byId');
      return getAllAssignments(req, res, next);
      //return getAssignmentById(req, res, next);
});

app.get('/v1/assignment/:id',basicAuth, (req, res, next) => {
  logger.info('Fetching all assignments');
  console.log('All Assignment')
  statsd.increment('endpoint.hits.v1.assignment.all');
  return getAssignmentById(req, res, next);
});

//Below API delete all the assignment
app.delete('/v1/assignment/:id', basicAuth, deleteAssignmentById);

//Below API update the assignment
app.put('/v1/assignment/:id', basicAuth, updateAssignmentById);

app.get('/healthz', async (req, res) => {
  try {
    //console.log('healthz')
    logger.info('healthz check initiated');
    // statsd.gauge('database.connection_success', 1);
    statsd.increment('endpoint.hits.v1.heathz.DB');
    await sequelize.authenticate(); // Check the database connectivity
    logger.info('Database connection has been established successfully.');

    res.status(200).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json({ status: 'ok' });

  } catch (error) {
    //console.error('Unable to connect to the database:', error);
    logger.error(`Unable to connect to the database: ${error}`);
    // statsd.gauge('database.connection_success', 1);
    // statsd.increment('endpoint.hits.v1.heathz.DB');
    res.status(503).set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    }).json({ status: 'error', message: 'Unable to connect to the database' });
  }
});

// New POST route for submissions
app.post('/v1/assignment/:id/submission', basicAuth, createSubmission);

app.patch('/v1/assignment', (req, res) => {
  res.status(405).json({ error: 'Method Not Allowed: Use PUT for full updates or specify fields to update with PATCH.' });
});


module.exports = app;

