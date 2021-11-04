import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Categories } from "../../models/Categories";

type RequestCategoryTypes = {
  description: string;
  categoryFee: number;
};

export const registerCategory = async (
  request: Request,
  response: Response
) => {
  try {
    const { categoryFee, description }: RequestCategoryTypes = request.body;

    if (!categoryFee || !description) {
      return response.status(401).json({ message: "Dados incompletos" });
    }

    const category = await getRepository(Categories).findOne({
      where: {
        description,
      },
    });

    if (category) {
      return response.status(302).json({ message: "Categoria já cadastrada" });
    }

    const newCategory = await getRepository(Categories).save({
      description,
      categoryFee,
    });

    if (newCategory) {
      return response.status(200).json(newCategory);
    }

    return response.status(400).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json({ error });
  }
};
