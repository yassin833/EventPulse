const {Server} = require('socket.io');
const Event = require('../models/event.model.js');

function startSocketServer(server) {
  const io = new Server(server);
  io.on('connection', socket => {
    console.log('User connected');
    socket.on('join-event', async eventId => {
      const eventIdValid = await Event.findById(eventId);
      if (!eventIdValid) {
        return socket.emit('error', 'Event specified is not found!');
      }
      socket.join(`event_${eventId}`);
      console.log('You joined the room');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  })
  return io;
}

module.exports = startSocketServer;