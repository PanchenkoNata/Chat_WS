const Room = require('models/room');
const User = require('models/user');

const init = () => new Promise((resolve, reject) => {
    Room.countDocuments()
        .then(async (count) => {
            if (!count) {
                const admin = await User.findOne( { name: 'Admin' });
                const date = new Date();
                const newRoom = new Room ({
                    name: 'all',
                    owner: admin.id,
                    users: [{ userId: admin.id, dateConnected: date }],
                });
                const room = await newRoom.save();
                admin.rooms.push(room.id);
                await admin.save();
                return room;
            } else {
                return false;
            }
        })
        .then((room) => {
            if (!room) {
                console.log('Collection Room already exists');
            } else {
                console.log('The collection Room has been successfully filled with values');
            }
            resolve();
        })
        .catch((error) => {
            reject(error.message);
        });
});

module.exports = init;
