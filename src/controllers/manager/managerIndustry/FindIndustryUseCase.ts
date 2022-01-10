import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../models/Industry";

class FindIndustryUseCase {
    async execute(){

        const users = await getRepository(Industries).find({
            select : ["id", "description", "categoryFee", "createdAt", "updatedAt", "iconCategory"]
        })

        if(!users){
            throw new InternalError("Não há ramos cadastrados", 400)
        }

        return users

    }
}

export {FindIndustryUseCase}