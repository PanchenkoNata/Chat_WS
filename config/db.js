module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/wsSocketChat',
    connect: {
      config: {
        autoIndex: false,
      },
      useNewUrlParser: true,
    },
  },
};
