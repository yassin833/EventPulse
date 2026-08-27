const {Server} = require('socket.io');
const Registration = require('../models/registration.model.js');
const requireSocketAuth = require('./authSocket.js');

function startSocketServer(server) {
  const io = new Server(server);
  io.use(requireSocketAuth);
  io.on('connection', socket => {
    console.log('User connected');
    socket.on('join-event', async eventId => {
      const userId = socket.user._id;
      const registrations = await Registration.find({
        user: userId,
        status: 'confirmed'
      });
      if (registrations.length === 0) {
        // Error thrown
        socket.emit('error', {
          text: 'The user is not registered in any event'
        });
      }
      const events = registrations.map(r => 
        r = r.event.toString()
      );
      const isRegistered = events.includes(eventId.toString());
      if (isRegistered) {
        socket.join(`event_${eventId}`);
        console.log('You joined the room');
        socket.emit('join-successful', {
          text: 'User joined successfully'
        });
      } else {
        socket.emit('error', {
          text: 'User did not join successfully'
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  })
  return io;
}

module.exports = startSocketServer;