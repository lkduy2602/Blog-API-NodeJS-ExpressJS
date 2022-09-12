import ErrorResponse from "../utils/errorResponse";

export const errorHandler = (err, req, res, next) => {
  let error = {
    ...err,
  };

  error.message = err.message;

  console.log(err);

  if (err.name === "CastError") {
    const message = `Không tìm thấy`;

    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = "Giá trị trường trùng lặp";

    error = new ErrorResponse(message, 400);
  }

  if (err.name === "ValidationError") {
    const message = [];

    Object.values(err.errors).forEach((errr) => {
      message.push({
        field: errr.properties.path,
        message: errr.message,
      });
    });

    error = new ErrorResponse(null, 400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.messageWithField || error.message || "Server Error",
  });
};
