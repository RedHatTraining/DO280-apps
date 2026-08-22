'use strict';

function validateCreateUpdateRequest (request, response, next) {
  if (Object.keys(request.body).length === 0) {
    response.status(415);
    return response.send('Invalid payload!');
  }

  // No need to check for no body, express will make body an empty object
  const { name, stock, id } = request.body;

  if (!name) {
    response.status(422);
    return response.send('The name is required!');
  }

  if (stock === null || isNaN(stock) || stock < 0) {
    response.status(422);
    return response.send('The stock must be greater or equal to 0!');
  }

  if (id && id !== request.params.id) {
    response.status(422);
    return response.send('Id was invalidly set on request.');
  }

  next();
}

module.exports = {
  validateCreateUpdateRequest
};
