const Assignment = require('../Models/Assignment');
const logger = require('../Utils/logger');
const statsd = require('../Utils/statsdClient');

exports.deleteAssignmentById = async (req, res) => {
    statsd.increment('endpoint.hits.v1.assignment.DeletingAssignment');
    try {

        if (req.body && Object.keys(req.body).length > 0) {
            logger.error('400 error Request body is not allowed in GET request');
            return res.status(400).json({ message: 'Request body is not allowed in GET request' });
        }
       // Retrieve ID from the request parameters
       const  id  = req.params.id;

       // Assuming req.user.id holds the authenticated user's ID
       const userId = req.user.id;

       // Retrieve the assignment to check the associated user
       const assignment = await Assignment.findOne({
           where: { id: id }
       });

       // Check if assignment exists
       if (!assignment) {
           logger.error('404 error Assignemnet not found');
           return res.status(404).json({ message: 'Assignment not found' });
       }

       // Check if user is authorized to delete the assignment
       if (assignment.userId !== userId) {
            logger.error('403 error Forbidden: You do not have permission to delete this assignment');
           return res.status(403).json({ message: 'Forbidden: You do not have permission to delete this assignment' });
       }

        // Attempt to delete the assignment with the given ID
        const deletedRowCount = await Assignment.destroy({
            where: { id: id }
        });

        // Check if any rows were deleted
        if (deletedRowCount === 0) {
            logger.error('404 error Assignment not found');
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // res.status(200).json({ message: 'Assignment deleted successfully' });
        logger.info('Deleted assignment sucessfully');      
        res.status(204).send();
    } catch (error) {
        logger.error('500 error server error');

        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
