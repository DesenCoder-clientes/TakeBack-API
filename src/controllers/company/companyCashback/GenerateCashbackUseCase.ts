import * as bcrypt from "bcrypt";
import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";

import { Companies } from "../../../models/Company";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  companyId: string;
  userId: string;
  userPassword: string;
  code: string;
  cashbackData: {
    costumer: {
      cpf: string;
      value: string;
    };
    method: [
      {
        method: string;
        value: string;
      }
    ];
  };
}

class GenerateCashbackUseCase {
  async execute({
    companyId,
    userId,
    userPassword,
    code,
    cashbackData: { costumer, method },
  }: Props) {
    // Verificando se todos os dados foram informados
    if (
      !userPassword ||
      !costumer.cpf ||
      !costumer.value ||
      method.length < 1
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    // Buscando o usuário da empresa
    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { id: userId },
      select: ["id", "password"],
    });

    // Verificando se a senha dele está correta
    const passwordMatch = await bcrypt.compare(
      userPassword,
      companyUser.password
    );
    if (!passwordMatch) {
      throw new InternalError("Erro ao validar a senha", 400);
    }

    // Verificando se o cliente está cadastrado e ativo
    const consumer = await getRepository(Consumers).findOne({
      where: { cpf: costumer.cpf },
    });

    if (!consumer) {
      throw new InternalError("O cliente não possui cadastro", 400);
    }

    if (consumer.deactivedAccount) {
      throw new InternalError("O cliente não está ativo", 400);
    }

    // Removendo valores nulos informados no array de métodos de pagamento
    const methodsWithoutNullItems = method.filter((item) => item !== null);

    // Verificando se foram informados métodos de pagamento duplicados
    const uniqueValue = methodsWithoutNullItems.filter(
      (elem, index, self) =>
        index === self.findIndex((item) => item.method === elem.method)
    );

    if (uniqueValue.length !== methodsWithoutNullItems.length) {
      throw new InternalError("Há itens duplicados", 400);
    }

    // Criando array com ID's dos métodos de pagamento diferentes do método TakeBack
    const methodsId = [];
    methodsWithoutNullItems.map((method) => {
      methodsId.push(parseInt(method.method));
    });

    // Buscando os métodos de pagamento a partir do array de ID's gerado
    const paymentMethods = await getRepository(CompanyPaymentMethods).find({
      where: { id: In([...methodsId]) },
      relations: ["company", "paymentMethod"],
    });

    // Calculando o valor do cashback
    let cashbackAmount = 0;
    let takebackMethodExist = false;
    let takebackMethodValue = 0;

    paymentMethods.map((localizedMethod) => {
      methodsWithoutNullItems.map((informedMethod) => {
        if (
          parseInt(informedMethod.method) === localizedMethod.id &&
          !localizedMethod.paymentMethod.isTakebackMethod
        ) {
          cashbackAmount =
            cashbackAmount +
            localizedMethod.cashbackPercentage *
              parseFloat(informedMethod.value);
        }

        if (
          parseInt(informedMethod.method) === localizedMethod.id &&
          localizedMethod.paymentMethod.isTakebackMethod
        ) {
          takebackMethodExist = true;
          takebackMethodValue = parseFloat(informedMethod.value);
        }
      });
    });

    // Verifica se há apenas o método de pagamento Takeback
    let onlyTakebackMethod = false;
    if (
      paymentMethods.length === 1 &&
      paymentMethods[0].paymentMethod.isTakebackMethod
    ) {
      onlyTakebackMethod = true;
    }

    // Buscando a empresa para injetar na tabela Transactions
    const company = await getRepository(Companies).findOne({
      where: { id: companyId },
      relations: ["industry"],
    });

    // Buscando status e tipos de transações para injetar na tabela Transactions
    const pendingStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Pendente" },
      select: ["id"],
    });

    const payWithTakebackStatus = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Pago com takeback" },
      select: ["id"],
    });

    // Calculando percentual total do cashback
    const cashbackPercent =
      cashbackAmount / (parseFloat(costumer.value) - takebackMethodValue);

    // Calculando o percentual da taxa da takeback
    const takebackFeePercent = company.customIndustryFeeActive
      ? company.customIndustryFee
      : company.industry.industryFee;

    // Calculando o valor da taxa da takeback
    const takebackFeeAmount = company.customIndustryFeeActive
      ? company.customIndustryFee * parseFloat(costumer.value)
      : company.industry.industryFee * parseFloat(costumer.value);

    // Verificando se está tudo ok com a chave de compra
    if (takebackMethodExist && (isNaN(parseInt(code)) || code.length === 0)) {
      throw new InternalError("Chave da compra não informada", 400);
    }

    // OPERAÇÃO DE ABATIMENTO DE SALDO DO CLIENTE
    let existentTransaction = null;
    if (takebackMethodExist && (!isNaN(parseInt(code)) || code.length > 0)) {
      const transactionAwait = await getRepository(TransactionStatus).findOne({
        where: { description: "Aguardando" },
      });

      existentTransaction = await getRepository(Transactions).findOne({
        where: {
          consumers: consumer,
          keyTransaction: parseInt(code),
          totalAmount: takebackMethodValue,
          transactionStatus: transactionAwait,
        },
        relations: ["consumers", "transactionStatus"],
      });

      if (!existentTransaction) {
        throw new InternalError("Compra não autorizada pelo cliente", 400);
      }

      let paymentValue = "";
      paymentMethods.map((databaseMethod) => {
        method.map((informedMethod) => {
          if (
            databaseMethod.id === parseInt(informedMethod.method) &&
            databaseMethod.paymentMethodId === 1
          ) {
            paymentValue = informedMethod.value.replace(",", ".");
          }
        });
      });

      const date = new Date();
      const updatedTransaction = await getRepository(Transactions).update(
        existentTransaction.id,
        {
          totalAmount: parseFloat(paymentValue),
          amountPayWithTakebackBalance: parseFloat(paymentValue),
          consumers: consumer,
          companies: company,
          companyUsers: companyUser,
          transactionStatus: payWithTakebackStatus,
          dateAt: date.toLocaleDateString(),
        }
      );

      if (updatedTransaction.affected === 0) {
        throw new InternalError("Houve um erro ao utilizar o cashback", 400);
      }

      // Atualizando saldo do consumidor
      const consumerBalanceUpdate = await getRepository(Consumers).update(
        consumer.id,
        {
          balance: consumer.balance - parseFloat(paymentValue),
        }
      );

      if (consumerBalanceUpdate.affected === 0) {
        throw new InternalError("Houve um erro ao emitir o cashback", 400);
      }

      // Atualizando saldo negativo da empresa
      const updatedCompanyPositiveBalance = await getRepository(
        Companies
      ).update(company.id, {
        positiveBalance: company.positiveBalance + parseFloat(paymentValue),
      });

      if (updatedCompanyPositiveBalance.affected === 0) {
        throw new InternalError("Erro ao atualizar saldo da empresa", 400);
      }
    }

    if (!takebackMethodExist) {
      // Salvando as informações na tabela de Transactions caso não tenha o método de pagamento TakeBack
      const date = new Date();
      const newCashback = await getRepository(Transactions).save({
        totalAmount: parseFloat(costumer.value),
        amountPayWithOthersMethods: parseFloat(costumer.value),
        cashbackAmount,
        cashbackPercent: parseFloat(cashbackPercent.toFixed(3)),
        takebackFeePercent,
        takebackFeeAmount,
        consumers: consumer,
        companies: company,
        companyUsers: companyUser,
        transactionStatus: pendingStatus,
        dateAt: date.toLocaleDateString(),
      });

      // Verificando se as informações foram salvas
      if (!newCashback) {
        throw new InternalError("Houve um erro ao emitir o cashback", 400);
      }

      // Atualizando saldo do consumidor
      const { affected } = await getRepository(Consumers).update(consumer.id, {
        blockedBalance: consumer.blockedBalance + cashbackAmount,
      });

      if (affected !== 1) {
        throw new InternalError("Houve um erro ao emitir o cashback", 400);
      }

      // Atualizando saldo negativo da empresa
      const updatedNegativeBalance = await getRepository(Companies).update(
        company.id,
        {
          negativeBalance:
            company.negativeBalance + (takebackFeeAmount + cashbackAmount),
        }
      );

      if (updatedNegativeBalance.affected === 0) {
        throw new InternalError("Erro ao atualizar saldo da empresa", 400);
      }

      // Salvando cada método de pagamento e seus valores na tabela TransactionPaymentMethods
      paymentMethods.map((databaseMethod) => {
        method.map((informedMethod) => {
          if (databaseMethod.id === parseInt(informedMethod.method)) {
            getRepository(TransactionPaymentMethods).save({
              transactions: newCashback,
              paymentMethod: databaseMethod,
              cashbackPercentage: databaseMethod.cashbackPercentage,
              cashbackValue:
                databaseMethod.cashbackPercentage *
                parseFloat(informedMethod.value),
            });
          }
        });
      });
    }

    if (takebackMethodExist && !onlyTakebackMethod) {
      // Salvando as informações na tabela de Transactions caso não tenha o método de pagamento TakeBack
      const updatedCashback = await getRepository(Transactions).update(
        existentTransaction.id,
        {
          totalAmount: parseFloat(costumer.value),
          amountPayWithOthersMethods:
            parseFloat(costumer.value) - takebackMethodValue,
          cashbackAmount,
          cashbackPercent: parseFloat(cashbackPercent.toFixed(3)),
          takebackFeePercent,
          takebackFeeAmount,
          consumers: consumer,
          companies: company,
          companyUsers: companyUser,
          transactionStatus: pendingStatus,
        }
      );

      // Verificando se as informações foram salvas
      if (updatedCashback.affected === 0) {
        throw new InternalError("Houve um erro ao emitir o cashback", 400);
      }

      // Atualizando saldo do consumidor
      const { affected } = await getRepository(Consumers).update(consumer.id, {
        blockedBalance: consumer.blockedBalance + cashbackAmount,
      });

      if (affected !== 1) {
        throw new InternalError("Houve um erro ao emitir o cashback", 400);
      }

      // Atualizando saldo negativo da empresa
      const updatedNegativeBalance = await getRepository(Companies).update(
        company.id,
        {
          negativeBalance:
            company.negativeBalance + (takebackFeeAmount + cashbackAmount),
        }
      );

      if (updatedNegativeBalance.affected === 0) {
        throw new InternalError("Erro ao atualizar saldo da empresa", 400);
      }

      const transactionUpdated = await getRepository(Transactions).findOne({
        where: { id: existentTransaction.id },
      });

      // Salvando cada método de pagamento e seus valores na tabela TransactionPaymentMethods
      paymentMethods.map((databaseMethod) => {
        method.map((informedMethod) => {
          if (databaseMethod.id === parseInt(informedMethod.method)) {
            getRepository(TransactionPaymentMethods).save({
              transactions: transactionUpdated,
              paymentMethod: databaseMethod,
              cashbackPercentage: databaseMethod.cashbackPercentage,
              cashbackValue:
                databaseMethod.cashbackPercentage *
                parseFloat(informedMethod.value),
            });
          }
        });
      });
    }

    return "Cashback emitido";
  }
}

export { GenerateCashbackUseCase };
