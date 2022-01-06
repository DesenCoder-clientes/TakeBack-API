import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { TakeBackUsers } from "../../models/TakeBackUsers";

interface Props
    {
        name: string,
        cpf: string,
        password: string,
        email: string,
        isActive: true,
        isRoot: boolean
    }
    


class GenerateTakeBackUserUseCase{
    async execute({
        name, 
        cpf, 
        password,
        email,
        isRoot
    }: Props){

        if(!name || !cpf || !password || !email || !isRoot){
            throw new InternalError("Dados incompletos!", 400);
        }

        const takeBackUser = await getRepository(TakeBackUsers).findOne({
            where: { cpf },
          });
      
          if (takeBackUser) {
            throw new InternalError("CPF já cadastrado", 302);
          }

        const saveTakeBackUser = await getRepository(TakeBackUsers).save({
            name, 
            cpf, 
            password,
            email,
            isRoot
        })

        if (saveTakeBackUser){
            return `Usuário ${name} gerado com sucesso!`    
        }
        

    }
}

export {GenerateTakeBackUserUseCase};