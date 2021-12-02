import { getRepository, TreeRepository } from "typeorm";
import { Request, Response } from "express";

import { Categories } from "../../models/Categories";

export const findAllCategories = async (
  request: Request,
  response: Response
) => {
  try {
    const categories = await getRepository(Categories).find();

    return response.status(200).json(categories);
  } catch (error) {
    return response.status(500).json(error);
  }
};
