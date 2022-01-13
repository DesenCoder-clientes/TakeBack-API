import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";

class FindUserUseCase {
    async execute(){

        const users = await getRepository(TakeBackUsers).find({
            select: ["name", "cpf", "email", "isActive", "phone", "id"],
            relations: ["userType"]
        })

        if(!users){
            throw new InternalError("Não há usuários cadastrados", 400)
        }

        return users

    }
}

export {FindUserUseCase}