/**
 * Useful for wrapping `async` request handlers in Express
 * so they automatically propagate errors.
 */
module.exports = function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((error) => {
      console.error(`Unexpected error in ${handler.name}!`);
      console.error(error.stack);

      next(error);
    });
  };
};
