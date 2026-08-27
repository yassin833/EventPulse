const {asyncHandler} = require('../../middleware/errorHandler.js');

describe('asyncHandler', () => {
  it('invokes the wrapped function with req, res, next', () => {
    const req = {}, res = {}, next = jest.fn();
    const fn = jest.fn().mockResolvedValue(undefined);
    asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('catches a rejected promise and passes the error to next()', async () => {
    const req = {}, res = {}, next = jest.fn();
    const error = new Error('Something went wrong');
    const fn = jest.fn().mockRejectedValue(error);
    await asyncHandler(fn)(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  })
})