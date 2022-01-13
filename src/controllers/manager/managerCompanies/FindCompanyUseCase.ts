import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { ParsedQs } from 'qs';
import { InternalError } from "../../../config/GenerateErros";

interface FilterProps{
    registeredNumber, fantasyName, status: string | ParsedQs | string[] | ParsedQs[]
}

class FindCompanyUseCase{
    async execute({fantasyName, registeredNumber, status}: FilterProps){

        const findCompany = await getRepository(Companies).find({
            select:["id", "fantasyName", "corporateName", "email"],
            relations: ["status"],
            where: {registeredNumber: registeredNumber , fantasyName: fantasyName, status: status},
        })
        if(!findCompany){
            throw new InternalError("Empresa não encontrada", 404);
        }
        return findCompany
    }
}

export {FindCompanyUseCase}