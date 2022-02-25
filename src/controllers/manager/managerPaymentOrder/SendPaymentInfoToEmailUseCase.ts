import { InternalError } from "../../../config/GenerateErros";

interface Props {
  email?: string;
}

class SendPaymentInfoToEmailUseCase {
  async execute({ email }: Props) {
    return "ok";
  }
}

export { SendPaymentInfoToEmailUseCase };
