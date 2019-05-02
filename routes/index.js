const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/chat', async (req, res, next) => {
  res.render('chat', { title: 'Chat_Socket.IO' })
})
module.exports = router;
