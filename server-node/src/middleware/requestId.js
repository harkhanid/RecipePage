import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (req, res, next) => {
  // Generate a unique ID for every request
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};
