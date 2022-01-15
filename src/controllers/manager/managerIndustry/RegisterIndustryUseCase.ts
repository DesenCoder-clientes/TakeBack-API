import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../models/Industry";

interface Props{
    description: string
    categoryFee: number
}

class RegisterIndustryUseCase{
    async execute({description, categoryFee}: Props){
        if(!description || !categoryFee){
            throw new InternalError("Dados incompletos", 400);
        }

        const findIndustry = await getRepository(Industries).findOne({
            where: {description : description}
        })

        if(findIndustry){
            throw new InternalError("Ramo já cadastrado", 302);
        }

        const registerIndustry = await getRepository(Industries).save({
            description,
            categoryFee
        })

        if(!registerIndustry){
            throw new InternalError("Erro ao cadastrar ramo", 400);
        }

        const industries = await getRepository(Industries).find({
            select : ["id", "categoryFee", "companies", "createdAt", "updatedAt", "description", "iconCategory"]
        })

        return `Ramo ${description} cadastrado com sucesso!` 
         
        }
}

export {RegisterIndustryUseCase}