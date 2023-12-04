// Controller/submissionController.js

const Submission  = require('../Models/submission'); // assuming Submission model is also exported from the models directory
const Assignment = require('../Models/Assignment'); 
const awsSnsPublisher = require('../services/awsSnsPublisher'); // This should be the module that handles SNS publishing
const logging = require('../Utils/logger');
require('dotenv').config();
let userEmail ='test'

function isValidURL(url) {
  const urlPattern = new RegExp(
    '^https?://' + // protocol
    '(www\\.)?' + // optional www subdomain
    '[a-zA-Z0-9-]+\\.[a-zA-Z]{2,6}' + // domain
    '(/[a-zA-Z0-9-._~:/?#[\\]@!$&\'()*+,;=%]+)?' // optional path
  );
 
  return urlPattern.test(url);
}
 
// Function to check if the content type is JSON
function isJson(req) {
  return req.headers['content-type'] === 'application/json';
}

exports.createSubmission = async (req, res, next) => {
  const { id } = req.params; // Assignment ID from URL
  const { submission_url } = req.body; // URL from the request body
  const user = req.user;
  if (user && user.email) {
    userEmail = user.email;
    console.log('userEmail')
    console.log(userEmail)
    }

    if (!isJson(req)) {
      logging.info('Invalid content type');
      return res.status(400).json({ message: 'Invalid content type. Request body must be JSON.' });
    }
 
    // Check if submission_url is present and is a valid URL
    if (!submission_url || !isValidURL(submission_url)) {
      logging.info('Invalid submission_url');
      return res.status(400).json({ message: 'Invalid submission_url' });
    }
 
    // Check if there are no additional parameters in the request body
    const validKeys = ['submission_url'];
    const additionalKeys = Object.keys(req.body).filter(key => !validKeys.includes(key));
 
    if (additionalKeys.length > 0) {
      logging.info('Invalid parameters in request body');
      return res.status(400).json({ message: 'Invalid parameters in request body. Only submission_url is allowed.' });
    }

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (new Date(assignment.deadline) < new Date()) {
      return res.status(400).json({ error: 'Assignment deadline has passed' });
    }

    const submissionsCount = await Submission.count({ where: { assignment_id: id } });
    console
    if (submissionsCount >= assignment.num_of_attempts) {
      return res.status(400).json({ error: 'Number of attempts exceeded' });
    }

    const newSubmission = await Submission.create({
      assignment_id: id,
      submission_url: submission_url,
    });
    console.log('submission done')
    // Inside your controller function, change the publish call to this:

    console.log(`Type of id: ${typeof id}`); // Should be 'string'
    console.log(`Type of submission_url: ${typeof submission_url}`); // Should be 'string'
    console.log(`Constructed message: ${`New submission for assignment ${id}: ${submission_url}`}`); 

    // const TopicArn = 'arn:aws:sns:us-east-1:372558015288:mySnsTopic-deba7d7'
    const TopicArn1 = process.env.SNS_ARN
    const message = JSON.stringify({
      submission_url: submission_url,
      user_email: userEmail,
    });

    // Correctly pass individual parameters, not an object
    await awsSnsPublisher.publish(
     message,
    'New Assignment Submission',
    TopicArn1 // Make sure TopicArn is defined
    );


    return res.status(201).json(newSubmission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
