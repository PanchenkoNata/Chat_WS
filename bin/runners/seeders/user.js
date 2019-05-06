// Подключаем модель User
const User = require('models/user');

const init = () => new Promise((resolve, reject) => {
    // get quantity of documents in collection User
    User.countDocuments()
        // count - this quantity
        .then((count) => {
            if (!count) {
                const user = new User({
                    name: 'Admin',
                    rooms: [],
                });
                return user.save();
            } else {
                return false;
            }
        })
        .then((user) => {
            if (!user) {
                console.log('Collection User already exists');
            } else {
                console.log('The collection User has been successfully filled with values');
            }

            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;