import axios from "axios";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../models/City";
import { Consumers } from "../../../models/Consumer";
import { ConsumerAddress } from "../../../models/ConsumerAddress";
import { State } from "../../../models/State";
import { apiCorreiosResponseType } from "../../../types/ApiCorreiosResponse";

interface ConsumerRequestToUpdateAddress {
  street: string;
  district: string;
  number: string;
  zipCode: string;
  complement: string;
  consumerID: string;
}

class CostumerUpdateAddressUseCase {
  async execute({
    street,
    district,
    number,
    zipCode,
    complement,
    consumerID,
  }: ConsumerRequestToUpdateAddress) {
    if (!street && !district && !number && !zipCode) {
      throw new InternalError("Dados não informados", 400);
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    const city = await getRepository(City).findOne({
      where: {
        zipCode,
      },
    });

    if (!city) {
      var {
        data: { localidade, uf },
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

      await getRepository(City).save({
        name: localidade,
        zipCode,
        state,
        complement,
      });
    }

    const { affected } = await getRepository(ConsumerAddress).update(
      consumer.address.id,
      {
        street,
        district,
        number,
        complement,
        city,
      }
    );

    if (affected === 0) {
      throw new InternalError("Houve um erro", 400);
    }

    return consumer;
  }
}

export { CostumerUpdateAddressUseCase };
