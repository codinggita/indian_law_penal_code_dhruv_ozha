/**
 * Standardized API Response utility.
 */
class ApiResponse {
  static success(res, message = 'Success', data = {}, statusCode = 200, pagination = null) {
    const payload = {
      success: true,
      message,
      data
    };
    if (pagination) {
      payload.pagination = pagination;
    }
    return res.status(statusCode).json(payload);
  }

  static error(res, message = 'Error occurred', error = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ? (error.message || error) : undefined
    });
  }
}

module.exports = ApiResponse;
