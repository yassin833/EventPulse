const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',       
    info: {title: 'StudentID EventPulse', version: '1.0.0', description: 'EventPulse backend API documentation. Protected routes return 401 if unauthenticated and 403 if authenticated but lacking the required role.'},
    servers: [{url: '/api'}],
    components: {
      securitySchemes: {
        bearerAuth: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}
      }
    },
    security: [{bearerAuth: []}]
  },
  apis: ['./routes/*.js']
}

module.exports = swaggerJsdoc(options);