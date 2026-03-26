import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    JSON.stringify({
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query,
      time: new Date().toISOString()
    })
  );
  next();
};