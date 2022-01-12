import { getRepository } from "typeorm";
import { ParsedQs } from 'qs';
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";


interface FilterProps{
    cpf, fullName, deactivedAccount: string | ParsedQs | string[] | ParsedQs[]
}

class FindConsumerUseCase{
    async execute({fullName, cpf, deactivedAccount}: FilterProps){
        const findConsumer = await getRepository(Consumers).find({
            select : ["cpf", "fullName", "email", "deactivedAccount"],
            where: {cpf: cpf, fullName: fullName, deactivedAccount: deactivedAccount}
        })

        if(!findConsumer){
            throw new InternalError("Cliente não encontrado", 404);
        }

        return findConsumer
    }
}

export {FindConsumerUseCase}