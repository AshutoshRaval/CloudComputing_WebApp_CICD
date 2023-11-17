#!/usr/bin/node
const app = require('./app');
const sequelize = require('./Models/db');
const loadUsersFromCSV = require('./Utils/csvLoaders');
const processUsers = require('./Utils/processUsers');
const User = require('./Models/User');
const Assignment = require('./Models/Assignment');
const logger = require('./Utils/logger');
const statsd = require('./Utils/statsdClient');
const PORT = 8080;

User.hasMany(Assignment, { foreignKey: 'userId', as: 'assignments' });
Assignment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

sequelize.sync()
    .then(() => loadUsersFromCSV('../opt/users.csv'))
    .then(users => processUsers(users))
    .then(() => {
        console.log("Finished processing users.");
        app.listen(PORT, () => {
            logger.info(`Server started on http://localhost:${PORT}`);
            logger.error(`error in logging file started`);
            console.log(`Server started on http://localhost:${PORT}`);
            statsd.gauge('server.start', 1);
        });
    })
    .catch(err => {
        console.error("Error:", err);
    });

    //test

