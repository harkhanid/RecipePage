export const errorHandler = (err, req, res, next) => {
  // console.error(`[${new Date().toISOString()}] ERROR:`, err);

  if (err.isCustom) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details || null,
    });
  }

  // fallback for unknown errors
  res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
};
