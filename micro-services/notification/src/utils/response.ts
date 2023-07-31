// Response handler for all successfull responses with a json body in response
export const formatResponse = (isSuccess, code, message, body = null) => {
  return {
    code,
    message,
    body,
    isSuccess,
    timestamp: new Date().toISOString(),
  };
};
