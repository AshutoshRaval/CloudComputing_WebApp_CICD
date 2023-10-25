#!/usr/bin/node
const app = require('./app');
const sequelize = require('./Models/db');
const loadUsersFromCSV = require('./Utils/csvLoaders');
const processUsers = require('./Utils/processUsers');
const User = require('./Models/User');
const Assignment = require('./Models/Assignment');
const PORT = 8080;

User.hasMany(Assignment, { foreignKey: 'userId', as: 'assignments' });
Assignment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

sequelize.sync()
    .then(() => loadUsersFromCSV('../opt/users.csv'))
    .then(users => processUsers(users))
    .then(() => {
        console.log("Finished processing users.");
        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });

