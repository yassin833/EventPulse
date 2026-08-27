require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db.js');

const User = require('./models/user.model.js');
const Category = require('./models/category.model.js');
const Event = require('./models/event.model.js');
const Registration = require('./models/registration.model.js');
const Message = require('./models/message.model.js');

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
    Message.deleteMany({})
  ]);

  console.log('Creating categories...');
  const categories = await Category.insertMany([
    { name: 'Music', description: 'Concerts, festivals, and live performances' },
    { name: 'Tech', description: 'Conferences, meetups, and workshops' },
    { name: 'Sports', description: 'Tournaments, matches, and sporting events' }
  ]);

  console.log('Creating users...');
  // Created one-by-one, not insertMany, so the pre('save') password-hashing hook actually runs
  const admin = await User.create({ name: 'Admin User', email: 'admin@eventpulse.com', password: 'password123', role: 'admin' });
  const attendee1 = await User.create({ name: 'Alice Attendee', email: 'alice@eventpulse.com', password: 'password123', role: 'attendee' });
  const attendee2 = await User.create({ name: 'Bob Attendee', email: 'bob@eventpulse.com', password: 'password123', role: 'attendee' });

  console.log('Creating events...');
  const events = await Event.insertMany([
    { title: 'Elden Ring Live Concert', description: 'An orchestral tribute to the Elden Ring soundtrack', date: new Date('2026-09-15'), city: 'Cairo', venue: 'Cairo Opera House', capacity: 3, category: categories[0]._id, createdBy: admin._id },
    { title: 'Backend Engineering Summit', description: 'Talks on Node.js, databases, and system design', date: new Date('2026-10-01'), city: 'Giza', venue: 'Smart Village Conference Hall', capacity: 2, category: categories[1]._id, createdBy: admin._id },
    { title: 'Cairo Marathon', description: 'Annual city marathon', date: new Date('2026-11-20'), city: 'Cairo', venue: 'Downtown Cairo', capacity: 100, category: categories[2]._id, createdBy: admin._id }
  ]);

  console.log('Creating registrations...');
  const registrations = await Registration.insertMany([
    { user: attendee1._id, event: events[0]._id, status: 'confirmed' },
    { user: attendee2._id, event: events[0]._id, status: 'confirmed' },
    { user: attendee1._id, event: events[1]._id, status: 'confirmed' },
    { user: attendee2._id, event: events[2]._id, status: 'cancelled' }
  ]);

  console.log('Creating announcements...');
  await Message.insertMany([
    { event: events[0]._id, sender: admin._id, text: 'Doors open 30 minutes before the show. See you there!' },
    { event: events[1]._id, sender: admin._id, text: 'Wifi password for the venue: backend2026' }
  ]);

  console.log('Seeding complete:', categories.length, 'categories,', events.length, 'events,', registrations.length, 'registrations, 2 announcements');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});