import { NextFunction, Request, Response } from "express";

const errorHandling = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(err.statusCode || 500).render("error/error", {
    title: "Error!",
    err,
  });
};

export default errorHandling;
