import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { InternalError } from "../../../config/GenerateErros";

interface CompanyReportProps {
  fantasyName?: string;
  registeredNumber?: string;
  status?: string;
}

class FindCompanyUseCase {
  async execute({ fantasyName, registeredNumber, status }: CompanyReportProps) {
    const nameIds = [];
    const registeredNumberIds = [];
    const statusIds = [];
    /* 
    const fantasyNames = await getRepository(Companies).findOne({
      select: ["fantasyName"],
    });
    fantasyNames.map((item) => {
      nameIds.push(item.id);
    });

    if (fantasyName && !nameIds.includes(parseInt(fantasyName))) {
      throw new InternalError("Nome não localizado", 404);
    }

    const registeredNumbers = await getRepository();
 */
    const findCompany = await getRepository(Companies).find({
      select: ["id", "fantasyName", "corporateName", "email"],
      relations: ["status"],
      where: {
        registeredNumber: registeredNumber,
        fantasyName: fantasyName,
        status: status,
      },
    });
    if (!findCompany) {
      throw new InternalError("Empresa não encontrada", 404);
    }
    return findCompany;
  }
}

export { FindCompanyUseCase };
