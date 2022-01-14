import { Response, Request } from "express";
import { CostumerRegisterSignatureUseCase } from "./CostumerRegisterSignatureUseCase";
import { CostumerUpdateAddressUseCase } from "./CostumerUpdateAddressUseCase";
import { CostumerUpdateDataUseCase } from "./CostumerUpdateDataUseCase";
import { CostumerUpdateEmailUseCase } from "./CostumerUpdateEmailUseCase";
import { CostumerUpdatePhoneUseCase } from "./CostumerUpdatePhoneUseCase";
import { CostumerUpdateSignatureUseCase } from "./CostumerUpdateSignatureUseCase";

interface ConsumerRequestToUpdateData {
  fullName: string;
  birthDate: Date;
}

interface ConsumerRequestToUpdatePhone {
  phone: string;
}

interface ConsumerRequestToUpdateEmail {
  email: string;
}

interface ConsumerRequestToUpdateAddress {
  street: string;
  district: string;
  number: string;
  zipCode: string;
  complement: string;
}

interface ConsumerRequestToRegisterSignature {
  newSignature: string;
}

interface ConsumerRequestToUpdateSignature {
  signature: string;
  newSignature: string;
}

class CostumerDataController {
  async updateData(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { birthDate, fullName }: ConsumerRequestToUpdateData = request.body;

    const update = new CostumerUpdateDataUseCase();

    const result = await update.execute({
      birthDate,
      fullName,
      consumerID,
    });

    response.status(201).json(result);
  }

  async updatePhone(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { phone }: ConsumerRequestToUpdatePhone = request.body;

    const update = new CostumerUpdatePhoneUseCase();

    const result = await update.execute({
      phone,
      consumerID,
    });

    response.status(201).json(result);
  }

  async updateEmail(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { email }: ConsumerRequestToUpdateEmail = request.body;

    const update = new CostumerUpdateEmailUseCase();

    const result = await update.execute({
      consumerID,
      email,
    });

    response.status(201).json(result);
  }

  async updateAddress(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const {
      complement,
      district,
      number,
      street,
      zipCode,
    }: ConsumerRequestToUpdateAddress = request.body;

    const update = new CostumerUpdateAddressUseCase();

    const result = await update.execute({
      complement,
      consumerID,
      district,
      number,
      street,
      zipCode,
    });

    response.status(201).json(result);
  }

  async registerSignature(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { newSignature }: ConsumerRequestToRegisterSignature = request.body;

    const register = new CostumerRegisterSignatureUseCase();

    const result = await register.execute({
      consumerID,
      newSignature,
    });

    response.status(201).json(result);
  }

  async updateSignature(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { newSignature, signature }: ConsumerRequestToUpdateSignature =
      request.body;

    const update = new CostumerUpdateSignatureUseCase();

    const result = await update.execute({
      consumerID,
      newSignature,
      signature,
    });

    response.status(201).json(result);
  }
}

export { CostumerDataController };
