const  Assignment1  = require('../Models/Assignment');
const User = require('../Models/User');  // Using the model file you've shared
const logger = require('../Utils/logger');
const statsd = require('../Utils/statsdClient');

exports.getAllAssignments = async (req, res) => {
    try {



        if (req.body && Object.keys(req.body).length > 0) {
            logger.error(`Request body is not allowed in GET request`)
            return res.status(400).json({ message: 'Request body is not allowed in GET request' });
        }

        const userId = req.user.id;
        const assignments = await Assignment1.findAll({
            // where: { userId: userId },
            // include: [{
            //     model: User,
            //     as: 'user',
            //     attributes: ['id', 'first_name', 'last_name', 'email']
            // }]
        });

        if (!assignments || assignments.length === 0) {
            logger.error(`No assignments found`);
            return res.status(404).json({ message: 'No assignments found' });
        }

        console.log(assignments)
        logger.info(`Assignments fetch Succesfully`);
        res.status(200).json({
            status: 'success',
            message: 'Assignments fetched successfully',
            data: assignments
        });
    } catch (error) {
    // return res.status(500).json({ message: "Server error", error: error.message });
    logger.error("An error occurred while fetching assignments")
    console.error("An error occurred while fetching assignments:", error); // Log detailed error server-side

    if (error.message && error.message.includes("ECONNREFUSED")) {
        // Database connection error
        logger.error(`Service unavailable. Please try again later.`);
        return res.status(503).json({ message: 'Service unavailable. Please try again later.' });
    }

    // Other types of errors
    logger.error(`An error occurred while fetching assignments.`);
    return res.status(500).json({ message: 'An error occurred while fetching assignments.' });
    }
};
