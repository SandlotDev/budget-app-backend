const status = {
  success: 200,
  created: 201,
  nocontent: 204,
  bad: 400,
  unauthorized: 401,
  forbidden: 403,
  notfound: 404,
  conflict: 409,
  error: 500,
};

const http200Response = (data, description) => ({
  status: 'success',
  detail: 'OK',
  description,
  data,
});

const http201Response = (data, description) => ({
  status: 'success',
  detail: 'Created',
  description,
  data,
});

const http204Response = (description) => ({
  status: 'success',
  detail: 'No Content',
  description,
});

const http400Message = (description) => ({
  status: 'error',
  detail: 'Bad Request',
  description,
});

const http401Message = (description) => ({
  status: 'error',
  detail: 'Unauthorized',
  description,
});

const http403Message = (description) => ({
  status: 'error',
  detail: 'Forbidden',
  description,
});

const http404Message = (description) => ({
  status: 'error',
  detail: 'Not Found',
  description,
});

const http409Message = (description) => ({
  status: 'error',
  detail: 'Conflict',
  description,
});

const http500Message = (description) => ({
  status: 'error',
  detail: 'Internal Server Error',
  description,
});

module.exports = {
  http200Response,
  http201Response,
  http204Response,
  http400Message,
  http401Message,
  http403Message,
  http404Message,
  http409Message,
  http500Message,
  status,
};
