module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/Chat_WS',
    connect: {
      config: {
        autoIndex: false,
      },
      useNewUrlParser: true,
    },
  },
};
