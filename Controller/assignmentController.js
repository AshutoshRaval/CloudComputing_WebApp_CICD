const { Assignment } = require('../Models/Assignment');
const sequelize = require('../Models/db');

exports.createAssignment = async (req, res) => {
    try {
        const {
            name, points, num_of_attempts, deadline
        } = req.body;

        const userId = req.user.id;

        // console.log(req.body)
        //Console

        //Test

        // 400 Bad Request for invalid input
        if (!name || !points || !num_of_attempts || !deadline) {
            return res.status(400).json({ message: 'Invalid input: All fields are required' });
        }

        // 401 Unauthorized if user id is not present
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (typeof name !== 'string' || name.trim() === "") {
            return res.status(400).json({ message: 'Invalid input: Name must be a non-empty string' });
        }
        
        if (!Number.isInteger(points) || points <= 0  || points >= 101) {
            return res.status(400).json({ message: 'Invalid input: Points must be a positive integer or between 0 to  100' });
        }
        
        if (!Number.isInteger(num_of_attempts) || num_of_attempts <= 0 || num_of_attempts >= 101) {
            return res.status(400).json({ message: 'Invalid input: Number of attempts must be a positive integer' });
        }

        if (isNaN(Date.parse(deadline))) {
            return res.status(400).json({ message: 'Invalid input: Deadline must be a valid date' });
        }
        //test

        // const userId = req.user.id;
        // console.log('In Create assignment')
        // console.log(req.body)
        // console.log('----')
        // console.log(userId)
        
        const newAssignment = await sequelize.models.Assignment.create({
            name,
            points,
            num_of_attempts,
            deadline,
            userId
        });

        res.status(201).json({ message: 'Assignment created successfully', data: newAssignment });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
