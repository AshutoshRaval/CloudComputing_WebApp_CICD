const Assignment = require('../Models/Assignment');

exports.updateAssignmentById = async (req, res) => {
    try {

        
        // Extracting the ID from the request parameters
        const { id } = req.query;
        const userId = req.user.id;

        //test

        // Validating the request body
        const { name, points, num_of_attempts, deadline } = req.body;
        console.log(deadline)

        if (!name && !points && !num_of_attempts && !deadline) {
            return res.status(400).json({ message: 'No fields to update were provided' });
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

        // Finding the assignment to update
        const assignment = await Assignment.findOne({ where: { id } });

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        
        if (assignment.userId !== userId) {
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
        res.status(204).send();

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
