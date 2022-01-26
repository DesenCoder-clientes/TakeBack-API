import * as bcrypt from "bcrypt";
import axios from "axios";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../models/City";
import { Consumers } from "../../../models/Consumer";
import { ConsumerAddress } from "../../../models/ConsumerAddress";
import { State } from "../../../models/State";
import { apiCorreiosResponseType } from "../../../types/ApiCorreiosResponse";
import { CPFValidate } from "../../../utils/CPFValidate";
import { generateToken } from "../../../config/JWT";

interface userDataProps {
  fullName: string;
  cpf: string;
  birthDate: Date;
  email: string;
  phone: string;
  zipCode: string;
  password: string;
}

class RegisterCostumerUseCase {
  async execute({
    fullName,
    cpf,
    birthDate,
    email,
    phone,
    zipCode,
    password,
  }: userDataProps) {
    if (!fullName || !cpf || !birthDate || !zipCode || !email || !password) {
      throw new InternalError("Dados incompletos", 401);
    }

    if (!CPFValidate(cpf)) {
      throw new InternalError("CPF inválido", 400);
    }

    const client = await getRepository(Consumers).findOne({ where: { cpf } });

    if (client) {
      throw new InternalError("CPF já cadastrado", 302);
    }

    const city = await getRepository(City).findOne({
      where: {
        zipCode,
      },
    });

    if (city) {
      var address = await getRepository(ConsumerAddress).save({
        city,
        street: "",
        district: "",
      });
    } else {
      var {
        data: { bairro, localidade, logradouro, uf },
      }: apiCorreiosResponseType = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`
      );

      if (!uf) {
        throw new InternalError("Cep não localizado", 404);
      }

      const state = await getRepository(State).findOne({
        where: {
          initials: uf,
        },
      });

      const newCity = await getRepository(City).save({
        name: localidade,
        zipCode,
        state,
      });

      var newAddress = await getRepository(ConsumerAddress).save({
        city: newCity,
        street: logradouro,
        district: bairro,
      });
    }

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const newClient = await getRepository(Consumers).save({
      fullName,
      birthDate,
      cpf,
      phone: " ",
      email,
      address: address ? address : newAddress,
      password: passwordEncrypted,
    });

    if (newClient) {
      const token = generateToken(
        {
          id: newClient.id,
          fullName: newClient.fullName,
          cpf: newClient.cpf,
          email: newClient.email,
        },
        process.env.JWT_PRIVATE_KEY,
        process.env.JWT_EXPIRES_IN
      );

      return { token, fullName };
    }

    throw new InternalError("Houve um erro", 400);
  }
}

export { RegisterCostumerUseCase };
