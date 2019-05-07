// const Ajv = require('ajv');
const urlParse = require('url-parse');
const User = require('models/user');
const Session = require('models/session');
const Room = require('models/room');

const allowUserToPage = async (req, res, next) => {
    const notAuthPage = ['/login'];
    // get pathName of url
    const url = urlParse(req.url, true);

    if(!req.session.userId) {
        if(notAuthPage.indexOf(url.pathname) === -1) {
            return res.redirect('/login');
        }
    } else {
        if(notAuthPage.indexOf(url.path) !== -1) {
            return res.redirect('/chat');
        }
    }

    next();
};

const loginView = async (req, res, next) => {
    res.render('login', { title: 'Login', data: {}, error: false });
};

const loginAction = async (req, res, next) => {
    const { userName } = req.body;

    // const loginObj = {
    //     userName: userName,
    // };

    try {
        // WARNING: make a validation
        // const ajv = new Ajv({ verboose: true });
        let user = await User.findOne({ 'name': userName });
        const room = await Room.findOne({ name: 'all' });
        // if user is't in DB create new user and save him in DB
        if (!user) {
            const newUser = new User( {
                name: userName,
                rooms: [room.id]
            });
            user = await newUser.save();
        };

        // create session for this user
        req.session.userId = user.id;
        const newSession = new Session ({
            ID: req.sessionID,
            userId: req.session.userId
        });
        await newSession.save();

        // add user to chat room 'all'
        const newUser = {
            userId: user.id,
            dateConnected: user.createdAt
        };
        // room.users.push(newUser);
        // await room.save();
        await Room.update(
            // { $push: { users: newUser },
            { $addToSet: { users: newUser } },
        );
        res.redirect('/chat');
    } catch (error) {
        console.error(error);
    }
}

module.exports.loginView = loginView;
module.exports.loginAction = loginAction;
module.exports.allowUserToPage = allowUserToPage;
