import { getRepository } from "typeorm";
import { Request, Response } from "express";
import axios from "axios";

import { Companies } from "../../models/Company";
import { Categories } from "../../models/Categories";
import { CompaniesAddress } from "../../models/CompanyAddress";
import { City } from "../../models/City";
import { State } from "../../models/State";

import { apiCorreiosResponseType } from "../../types/ApiCorreiosResponse";

type companyDataTypes = {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  category: Categories;
  zipCode: string;
};

export const signUp = async (request: Request, response: Response) => {
  try {
    const {
      category,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    }: companyDataTypes = request.body;

    if (
      !category ||
      !corporateName ||
      !email ||
      !fantasyName ||
      !phone ||
      !registeredNumber ||
      !zipCode
    ) {
      return response.status(401).json({ message: "Dados incompletos" });
    }

    const company = await getRepository(Companies).findOne({
      where: {
        registeredNumber,
      },
    });

    if (company) {
      return response.status(302).json({ message: "CNPJ já cadastrado" });
    }

    const city = await getRepository(City).findOne({
      where: {
        zipCode,
      },
    });

    if (city) {
      var address = await getRepository(CompaniesAddress).save({
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

      var newAddress = await getRepository(CompaniesAddress).save({
        city: newCity,
        street: logradouro,
        district: bairro,
      });
    }

    const newCompany = await getRepository(Companies).save({
      corporateName,
      fantasyName,
      registeredNumber,
      email,
      phone,
      address: address ? address : newAddress,
      category: category,
    });

    if (newCompany) {
      return response.status(200).json(newCompany);
    }

    return response.status(400).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json(error);
  }
};
