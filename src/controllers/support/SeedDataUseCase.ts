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

const StatesSeed = [
  {
    name: "Acre",
    initials: "AC",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Alagoas",
    initials: "AL",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Amapá",
    initials: "AP",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Amazonas",
    initials: "AM",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Bahia",
    initials: "BA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ceará",
    initials: "CE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Espírito Santo",
    initials: "ES",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Goiás",
    initials: "Go",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maranhão",
    initials: "MA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mato Grosso",
    initials: "MT",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Mato Grosso do Sul",
    initials: "MS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Minas Gerais",
    initials: "MG",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pará",
    initials: "PA",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Paraíba",
    initials: "PB",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Paraná",
    initials: "PR",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pernambuco",
    initials: "PE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Piauí",
    initials: "PI",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rio de Janeiro",
    initials: "RJ",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rio Grande do Norte",
    initials: "RN",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rio Grande do Sul",
    initials: "RS",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Rondônia",
    initials: "RO",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Roraima",
    initials: "RR",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Santa Catarina",
    initials: "SC",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "São Paulo",
    initials: "SP",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sergipe",
    initials: "SE",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tocantins",
    initials: "TO",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Distrito Federal",
    initials: "DF",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const PaymentOrderMethodsSeed = [
  {
    description: "Saldo Takeback",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "PIX",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Boleto",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const TransactionStatusSeed = [
  {
    description: "Pendente",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Aprovada",
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Pago com takeback",
    blocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Aguardando",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cancelada pelo parceiro",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cancelada pelo cliente",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Em processamento",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Em atraso",
    blocked: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const CompanyUserTypesSeed = [
  {
    description: "Administrador",
    isManager: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Colaborador",
    isManager: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const PaymentPlanSeed = [
  {
    description: "Plano padrão",
    value: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const PaymentOrderStatusSeed = [
  {
    description: "Pagamento solicitado",
  },
  {
    description: "Aguardando pagamento",
  },
  {
    description: "Cancelada",
  },
  {
    description: "Autorizada",
  },
];

const CompanyStatusSeed = [
  {
    description: "Ativo",
    blocked: false,
    generateCashback: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Bloqueado",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cadastro solicitado",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Em análise",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Documentação pendente",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Inadimplente por cashbacks",
    blocked: false,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Inadimplente por mensalidade",
    blocked: false,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Cadastro não aprovado",
    blocked: true,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Demonstração",
    blocked: false,
    generateCashback: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const tbUserTypes = [
  {
    description: "Root",
    isRoot: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Administrativo",
    isRoot: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    description: "Colaborador",
    isRoot: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface Props {
  cpf: string;
  email: string;
  name: string;
}

class GenerateSeedData {
  async execute({ cpf, email, name }: Props) {
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

    // Gerando os Status das Transações
    const generatedTransactionStatus = await getRepository(
      TransactionStatus
    ).save(TransactionStatusSeed);

    if (generatedTransactionStatus.length === 0) {
      return new InternalError("Erro ao gerar os status de transações", 400);
    }

    // Gerando formas de pagamento para ordens de pagamento
    const generatePaymentMethodForPaymentOrder = await getRepository(
      PaymentOrderMethods
    ).save(PaymentOrderMethodsSeed);

    if (generatePaymentMethodForPaymentOrder.length === 0) {
      return new InternalError(
        "Erro ao gerar formas de pagamento para ordens de pagamento",
        400
      );
    }

    // Gerando status das ordens de pagamento
    const generatePaymentOrderStatus = await getRepository(
      PaymentOrderStatus
    ).save(PaymentOrderStatusSeed);

    if (generatePaymentOrderStatus.length === 0) {
      return new InternalError(
        "Erro ao gerar os status das ordens de pagamento",
        400
      );
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

    // Gerando valor default para o Plano de Pagamento
    const generatePaymentPlan = await getRepository(PaymentPlans).save(
      PaymentPlanSeed
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
      tbUserTypes
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

export { GenerateSeedData };
