import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";

import { State } from "../../models/State";
import { City } from "../../models/City";
import { TransactionTypes } from "../../models/TransactionType";
import { TransactionStatus } from "../../models/TransactionStatus";
import { CompanyUserTypes } from "../../models/CompanyUserTypes";
import { CompanyStatus } from "../../models/CompanyStatus";

import { StatesSeed } from "../../database/seeds/states.seed";
import { TransactionTypesSeed } from "../../database/seeds/transactionTypes.seed";
import { TransactionStatusSeed } from "../../database/seeds/transactionStatus.seed";
import { CompanyUserTypesSeed } from "../../database/seeds/companyUserTypes.seed";
import { CompanyStatusSeed } from "../../database/seeds/companyStatus.seed";

class GenerateSeedData {
  async execute() {
    const [, count] = await getRepository(State).findAndCount();

    if (count > 0) {
      return new InternalError("Operação já executada", 400);
    }

    // Gerando os Estados
    const generetadStatesData = await getRepository(State).save(StatesSeed);

    if (generetadStatesData.length === 0) {
      return new InternalError("Erro ao gerar os estados", 400);
    }

    // Gerando a Cidade de Porteirinha
    const minas = await getRepository(State).findOne({
      where: {
        initials: "MG",
      },
    });

    const generatedCitiesData = await getRepository(City).save({
      name: "Porteirinha",
      zipCode: "39520000",
      state: minas,
    });

    if (!generatedCitiesData) {
      return new InternalError("Erro ao gerar a cidade", 400);
    }

    // Gerando os Tipos de Transações
    const generatedTransactionTypes = await getRepository(
      TransactionTypes
    ).save(TransactionTypesSeed);

    if (generatedTransactionTypes.length === 0) {
      return new InternalError("Erro ao gerar os tipos de transações", 400);
    }

    // Gerando os Status das Transações
    const generatedTransactionStatus = await getRepository(
      TransactionStatus
    ).save(TransactionStatusSeed);

    if (generatedTransactionStatus.length === 0) {
      return new InternalError("Erro ao gerar os status de transações", 400);
    }

    // Gerando os Tipos de Usuários
    const generatedUserTypes = await getRepository(CompanyUserTypes).save(
      CompanyUserTypesSeed
    );

    if (generatedUserTypes.length === 0) {
      return new InternalError("Erro ao gerar os tipos de usuários", 400);
    }

    // Gerando os Status das Empresas Parceiras
    const generatedCompanyStatus = await getRepository(CompanyStatus).save(
      CompanyStatusSeed
    );
    if (generatedCompanyStatus.length === 0) {
      return new InternalError("Erro ao gerar os status das empresas", 400);
    }

    return "Dados semeados";
  }
}

export { GenerateSeedData };
