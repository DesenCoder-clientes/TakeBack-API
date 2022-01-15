import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Transactions } from "../../../models/Transaction";

interface CancelProps {
  companyID: string;
  transactionID: string;
  cancellationDescription: string;
}

class CancelCashBackUseCase {
  async execute({
    companyID,
    cancellationDescription,
    transactionID,
  }: CancelProps) {
    if (!cancellationDescription) {
      throw new InternalError("Campos incompletos", 401);
    }

    const company = await getRepository(Companies).findOne(companyID);

    const transaction = await getRepository(Transactions).findOne(
      transactionID,
      {
        select: ["id"],
        where: { companies: company },
      }
    );

    if (transaction) {
      await getRepository(Transactions).delete(transactionID);
    }
  }
}

export { CancelCashBackUseCase };
