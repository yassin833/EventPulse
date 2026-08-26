const {AppError} = require('../../middleware/errorHandler.js');

describe('AppError', () => {
  it('produces statusCode 404 and status "fail"', () => {
    const err = new AppError('Not found', 404);
    expect(err.statusCode).toBe(404);
    expect(err.status).toBe('fail');
  });

  it('produces statusCode 500 and status "error', () => {
    const err = new AppError('Internal Server error',  500);
    expect(err.statusCode).toBe(500);
    expect(err.status).toBe('error');
  });

  it('defaults isOperational to true', () => {
    const err = new AppError('Not found', 404);
    expect(err.isOperational).toBe(true);
  });

  it('is an instance of native Error', () => {
    const err = new AppError('Not found', 404);
    expect(err).toBeInstanceOf(Error);
  })
})