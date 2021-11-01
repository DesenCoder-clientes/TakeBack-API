import { getRepository } from "typeorm";
import { Request, Response } from "express";
import axios from "axios";
import * as bcrypt from "bcrypt";

import { Consumers } from "../../models/Consumer";
import { ConsumerAddress } from "../../models/ConsumerAddress";
import { City } from "../../models/City";

import { CPFValidate } from "../../utils/CPFValidate";
import { generateToken } from "../../config/JWT";
import { State } from "../../models/State";

import { apiCorreiosResponseType } from "../../types/ApiCorreiosResponse";

type loginTypes = {
  cpf: string;
  password: string;
  remember: boolean;
};

type userDataTypes = {
  id: string;
  fullName: string;
  cpf: string;
  birthDate: Date;
  email: string;
  phone: string;
  zipCode: string;
  password: string;
};

export const signIn = async (request: Request, response: Response) => {
  try {
    const { cpf, password }: loginTypes = request.body;

    if (!cpf || !password) {
      return response.status(401).json({ message: "Dados incompletos" });
    }

    const client = await getRepository(Consumers).findOne({
      where: {
        cpf,
      },
      select: ["id", "fullName", "cpf", "email", "password"],
    });

    if (!client) {
      return response.status(404).json({ message: "CPF não cadastrado" });
    }

    const passwordMatch = await bcrypt.compare(password, client.password);

    if (!passwordMatch) {
      return response.status(401).json({ message: "Senha incorreta" });
    }

    const token = generateToken(
      { id: client.id },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return response.status(200).json({ ACCESS_TOKEN: token });
  } catch (error) {
    return response.status(400).json(error);
  }
};

export const registerNewClient = async (
  request: Request,
  response: Response
) => {
  try {
    const {
      fullName,
      cpf,
      birthDate,
      email,
      zipCode,
      password,
    }: userDataTypes = request.body.userData;

    if (!fullName || !cpf || !birthDate || !zipCode || !email || !password) {
      return response.status(401).json({ message: "Dados incompletos" });
    }

    if (!CPFValidate(cpf)) {
      return response.status(400).json({ message: "CPF inválido" });
    }

    const client = await getRepository(Consumers).findOne({ where: { cpf } });

    if (client) {
      return response.status(302).json({ message: "CPF já cadastrado" });
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
        return response.status(404).json({ message: "Cep não localizado" });
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

      return response.status(200).json({ ACCESS_TOKEN: token });
    }

    return response.status(400).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(400).json({ message: "Erro inesperado" });
  }
};
