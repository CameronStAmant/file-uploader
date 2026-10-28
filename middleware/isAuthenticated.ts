import { NextFunction, Request, Response } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.currentUser) res.redirect("/");
  next();
};

export default isAuthenticated;
