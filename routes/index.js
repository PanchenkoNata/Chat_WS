const express = require('express');
const router = express.Router();

const loginController = require('controllers/login');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/login', loginController.loginView);
router.post('/login', loginController.loginAction);
router.get('/chat', async (req, res, next) => {
  res.render('chat', { title: 'Chat_Socket.IO', roomName: 'all' });
})
module.exports = router;
