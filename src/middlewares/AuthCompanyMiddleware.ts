import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { InternalError } from "../config/GenerateErros";
import { Companies } from "../models/Company";

export const AuthCompanyMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { companyId } = request["tokenPayload"];

  if (!companyId) {
    throw new InternalError("Não autorizado", 401);
  }

  const company = await getRepository(Companies).findOne({
    select: ["id", "status"],
    relations: ["status"],
    where: { id: companyId },
    cache: true,
  });

  if (!company) {
    throw new InternalError("Não autorizado", 401);
  }

  if (company.status.blocked) {
    throw new InternalError("Não autorizado", 401);
  }

  next();
};
