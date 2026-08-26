require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const {createServer} = require('http');
const server = createServer(app);
const startSocketServer = require('./config/socket.js');
const connectDB = require('./config/db.js');
connectDB().catch(err => console.error('DB connection failed:', err));
const {errorHandler, AppError} = require('./middleware/errorHandler.js');
const swaggerSpec = require(path.join(__dirname, 'config/swagger.js'));
const userRoutes = require('./routes/userRoutes.js');
const eventRoutes = require('./routes/eventRoutes.js');
const announceRoutes = require('./routes/announceRoutes.js');
const registrationRoutes = require('./routes/registrationRoutes.js');
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

const io = startSocketServer(server);
app.set('io', io);


app.use(express.json());
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>EventPulse API Docs</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/api-docs.json',
            dom_id: '#swagger-ui'
          });
        };
      </script>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  function formatTime(seconds) {
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    uptime: formatTime(process.uptime()),
    connectionStatus: 'connected'
});
});

app.get('/', (req, res) => {
  res.send('Welcome to our EventPulse website');
});

app.use('/api/auth', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announceRoutes);

// 404 error-handler
app.use((req, res, next) => {
  return next(new AppError("Enpoint doesn't exist", 404));
});

// Central error-handler
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

if (require.main === module) {
  startServer();
}

module.exports = app;