const successMessage = (res, statusCode, message, data, status='success') => {
  return res.status(statusCode).json({status, message, data});
}

const errorMessage = (res, statusCode, message, status, stack, data=null) => {
  return res.status(statusCode).json({status, message, data, stack});
}

module.exports = {successMessage, errorMessage}