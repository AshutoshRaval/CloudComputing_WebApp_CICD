const Assignment = require('../Models/Assignment');
const logger = require('../Utils/logger');
const statsd = require('../Utils/statsdClient');

exports.updateAssignmentById = async (req, res) => {
    statsd.increment('endpoint.hits.v1.assignment.UpdatingAssignment');
    try {

        
        // Extracting the ID from the request parameters
        // const { id } = req.query;
        const  id  = req.params.id;
        const userId = req.user.id;

        //test

        // Validating the request body
        const { name, points, num_of_attempts, deadline } = req.body;
        console.log(deadline)

        if (!name && !points && !num_of_attempts && !deadline) {
            logger.error('400 No fields to update were provided');
            return res.status(400).json({ message: 'No fields to update were provided' });
        }

         // 401 Unauthorized if user id is not present
         if (!req.user || !req.user.id) {
            logger.error('401 Unauthorized');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (typeof name !== 'string' || name.trim() === "") {
            logger.error('400 Invalid input: Name must be a non-empty string');
            return res.status(400).json({ message: 'Invalid input: Name must be a non-empty string' });
        }
        
        if (!Number.isInteger(points) || points <= 0  || points >= 101) {
            logger.error('400 Invalid input: Points must be a positive integer or between 0 to  100');
            return res.status(400).json({ message: 'Invalid input: Points must be a positive integer or between 0 to  100' });
        }
        
        if (!Number.isInteger(num_of_attempts) || num_of_attempts <= 0 || num_of_attempts >= 101) {
            logger.error('400 Invalid input: Number of attempts must be a positive integer');
            return res.status(400).json({ message: 'Invalid input: Number of attempts must be a positive integer' });
        }

        if (isNaN(Date.parse(deadline))) {
            logger.error('400 Invalid input: Deadline must be a valid date');
            return res.status(400).json({ message: 'Invalid input: Deadline must be a valid date' });
        }

        // Finding the assignment to update
        const assignment = await Assignment.findOne({ where: { id } });

        if (!assignment) {
            logger.error('500 Assignment not found');
            return res.status(404).json({ message: 'Assignment not found' });
        }

        
        if (assignment.userId !== userId) {
            logger.error('403 Forbidden: You do not have permission to Update this assignment');
            return res.status(403).json({ message: 'Forbidden: You do not have permission to Update this assignment' });
        }

        // Updating the assignment
        if (name) assignment.name = name;
        if (points) assignment.points = points;
        if (num_of_attempts) assignment.num_of_attempts = num_of_attempts;
        if (deadline) assignment.deadline = deadline;

        await assignment.save();

        // Sending the updated assignment in the response
        // res.status(200).json({
        //     message: 'Assignment updated successfully',
        //     data: assignment
        // });
        logger.info('204 updated assignment');
        res.status(204).send();

    } catch (error) {
        logger.error('500 server error');

        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
