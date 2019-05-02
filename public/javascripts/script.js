const socket = io();

// setTimeout(() => {
//   socket.emit('city', { city: 'Kyiv' });
// }, 5 * 1000);

setTimeout(() => {
  socket.emit('invite', { city: 'Kyiv'}, (data) => {
    console.log(data);
  });
}, 5 * 100);