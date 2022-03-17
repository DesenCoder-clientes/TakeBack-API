import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import * as bcrypt from "bcrypt";

import { State } from "../../models/State";
import { City } from "../../models/City";
import { TransactionStatus } from "../../models/TransactionStatus";
import { CompanyUserTypes } from "../../models/CompanyUserTypes";
import { CompanyStatus } from "../../models/CompanyStatus";
import { PaymentMethods } from "../../models/PaymentMethod";
import { TakeBackUserTypes } from "../../models/TakeBackUserTypes";
import { TakeBackUsers } from "../../models/TakeBackUsers";
import { generateRandomNumber } from "../../utils/RandomValueGenerate";
import { sendMail } from "../../utils/SendMail";
import { PaymentPlans } from "../../models/PaymentPlans";
import { PaymentOrderStatus } from "../../models/PaymentOrderStatus";
import { PaymentOrderMethods } from "../../models/PaymentOrderMethods";

import * as seedData from "./SeedData";
interface Props {
  cpf: string;
  email: string;
  name: string;
}

class GenerateSeedDataUseCase {
  async execute({ cpf, email, name }: Props) {
    const [, count] = await getRepository(State).findAndCount();

    if (count > 0) {
      return new InternalError("Operação já executada", 400);
    }

    // Gerando os Estados
    const generetadStatesData = await getRepository(State).save(
      seedData.StatesSeed
    );

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

    // Gerando os Status das Transações
    const generatedTransactionStatus = await getRepository(
      TransactionStatus
    ).save(seedData.TransactionStatusSeed);

    if (generatedTransactionStatus.length === 0) {
      return new InternalError("Erro ao gerar os status de transações", 400);
    }

    // Gerando formas de pagamento para ordens de pagamento
    const generatePaymentMethodForPaymentOrder = await getRepository(
      PaymentOrderMethods
    ).save(seedData.PaymentOrderMethodsSeed);

    if (generatePaymentMethodForPaymentOrder.length === 0) {
      return new InternalError(
        "Erro ao gerar formas de pagamento para ordens de pagamento",
        400
      );
    }

    // Gerando status das ordens de pagamento
    const generatePaymentOrderStatus = await getRepository(
      PaymentOrderStatus
    ).save(seedData.PaymentOrderStatusSeed);

    if (generatePaymentOrderStatus.length === 0) {
      return new InternalError(
        "Erro ao gerar os status das ordens de pagamento",
        400
      );
    }

    // Gerando os Tipos de Usuários
    const generatedUserTypes = await getRepository(CompanyUserTypes).save(
      seedData.CompanyUserTypesSeed
    );

    if (generatedUserTypes.length === 0) {
      return new InternalError("Erro ao gerar os tipos de usuários", 400);
    }

    // Gerando os Status das Empresas Parceiras
    const generatedCompanyStatus = await getRepository(CompanyStatus).save(
      seedData.CompanyStatusSeed
    );

    if (generatedCompanyStatus.length === 0) {
      return new InternalError("Erro ao gerar os status das empresas", 400);
    }

    // Gerando valor default para o Plano de Pagamento
    const generatePaymentPlan = await getRepository(PaymentPlans).save(
      seedData.PaymentPlanSeed
    );

    if (generatePaymentPlan.length === 0) {
      return new InternalError(
        "Erro ao gerar o plano padrão das empresas",
        400
      );
    }

    // Gerando o método de pagamneto Takeback
    const generatedPaymentMethod = await getRepository(PaymentMethods).save({
      description: "Takeback",
      isTakebackMethod: true,
    });

    if (!generatedPaymentMethod) {
      return new InternalError("Erro ao gerar método de pagamento", 400);
    }

    // Gerando tipos de usuários take back
    const takeBackUserTypes = await getRepository(TakeBackUserTypes).save(
      seedData.tbUserTypes
    );

    if (!takeBackUserTypes) {
      return new InternalError(
        "Erro ao gerar tipo de usuário do take back",
        400
      );
    }

    const newPassword = generateRandomNumber(100000, 999999);
    const sendedPasswordEncrypted = bcrypt.hashSync(newPassword.toString(), 10);

    const takeBackUsers = await getRepository(TakeBackUsers).save({
      cpf,
      email,
      name,
      phone: "",
      userType: takeBackUserTypes[0],
      isActive: true,
      password: sendedPasswordEncrypted,
    });

    if (!takeBackUsers) {
      return new InternalError("Erro ao gerar usuário do take back", 400);
    }

    const message = `Bem vindo ${name}! CPF.: ${cpf}, Senha.: ${newPassword}`;

    sendMail(email, "Usuário ROOT", message);

    return "Dados semeados";
  }
}

export { GenerateSeedDataUseCase };
