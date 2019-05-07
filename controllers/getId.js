const cookieParser = require('cookie');
const Session = require('models/session');

function SessionIdFromSocket(socket) {
    const handshakeData = socket.request;
    const hdsid = handshakeData.headers.cookie;
    const parsSid = cookieParser.parse(hdsid).sid;
    // console.log(`sid: --- ${parsSid}`);
    const sID = parsSid.split(':')[1].split('.')[0];
    console.log(sID);
    return sID;
};

function SessionIdFromSocketGl(socket) {
    // const handshakeData = socket.request;
    const hdsid = socket.handshake.headers.cookie;
    const parsSid = cookieParser.parse(hdsid).sid;
    // console.log(`sid: --- ${parsSid}`);
    const sID = parsSid.split(':')[1].split('.')[0];
    console.log(`GetId -- sid -- ${sID}`);
    return sID;
};

async function userIdFromSession(sid) {
    const session = await Session.findOne({ ID: sid });
    return session.userId;
};

module.exports.SessionIdFromSocket = SessionIdFromSocket;
module.exports.SessionIdFromSocketGl = SessionIdFromSocketGl;
module.exports.userIdFromSession = userIdFromSession;
  