import { getRepository } from "typeorm";
import { Consumers } from "../../../models/Consumer";

interface Props{
    limit: string
    offset: string
}

class ListConsumersUseCase{
    async execute({limit, offset}: Props){
        const findConsumer = await getRepository(Consumers).find({
            select: ["id", "fullName", "cpf", "phone", "balance"],
            take: parseInt(limit),
            skip: parseInt(offset) * parseInt(limit)
        })

        if (findConsumer.length === 0) {
            return false
        }
        
        return findConsumer
    }

}

export {ListConsumersUseCase}