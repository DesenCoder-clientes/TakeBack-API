import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { TakeBackUsers } from "../../models/TakeBackUsers";
import { sendMail } from "../../utils/SendMail";
import { generateRandomNumber } from "../../utils/RandomValueGenerate";

interface Props
    {
        name: string,
        cpf: string,
        email: string,
        isActive: true,
        isRoot: boolean
    }
    


class GenerateTakeBackUserUseCase{
    async execute({
        name, 
        cpf, 
        email,
        isRoot
    }: Props){

        if(!name || !cpf || !email || !isRoot){
            throw new InternalError("Dados incompletos!", 400);
        }

        const takeBackUser = await getRepository(TakeBackUsers).findOne({
            where: { cpf },
          });
      
          if (takeBackUser) {
            throw new InternalError("CPF já cadastrado", 302);
          }


        const newPassword = generateRandomNumber(100000, 999999);
        const newPasswordEncrypted = bcrypt.hashSync(
            JSON.stringify(newPassword),
            10
          );

        const saveTakeBackUser = await getRepository(TakeBackUsers).save({
            name, 
            cpf, 
            email,
            isRoot,
            password: newPasswordEncrypted
        })

        if (saveTakeBackUser){
            const newMessage = `Usuário ${name} foi cadastrado! Para acessar o sistema utilize as seguintes credenciais.: CPF: "${
                cpf
              }", Usuário: "${name}", Senha: "${newPassword}"`;
        
              sendMail(email, "TakeBack - Acesso ao sistema", newMessage);
              return `Usuário ${name} cadastrado com sucesso!`;    
        }
        

        if (saveTakeBackUser){
            return `Usuário ${name} gerado com sucesso!`    
        }
        

    }
}

export {GenerateTakeBackUserUseCase};