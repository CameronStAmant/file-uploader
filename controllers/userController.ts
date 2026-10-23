import { Request, Response } from "express";

const index = async (req: Request, res: Response) => {
  res.render("users", { title: "User list" });
};

export default {
  index,
};
