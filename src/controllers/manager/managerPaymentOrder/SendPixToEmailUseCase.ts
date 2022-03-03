import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import transporter from "../../../config/SMTP";
import { Companies } from "../../../models/Company";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

interface Props {
  paymentOrderId: number;
  pixKey: string;
  useCustomEmail: string;
  customEmail: string;
}

class SendPixToEmailUseCase {
  async execute({
    paymentOrderId,
    pixKey,
    useCustomEmail,
    customEmail,
  }: Props) {
    if (!paymentOrderId || !pixKey) {
      throw new InternalError("Boleto não informado", 400);
    }

    if (useCustomEmail === "true" && !customEmail) {
      throw new InternalError("Email não informado", 400);
    }

    const paymentOrder = await getRepository(PaymentOrder).findOne({
      where: { id: paymentOrderId },
      relations: ["company"],
    });

    if (!paymentOrder) {
      throw new InternalError("Ordem de pagamento não localizada", 404);
    }

    const company = await getRepository(Companies).findOne({
      where: { id: paymentOrder.company.id },
    });

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    const message = `Segue a chave PIX para o pagamento dos cashbacks contidos na ordem de pagamento número: ${paymentOrder.id}. CHAVE PIX.: ${pixKey}`;

    transporter.sendMail(
      {
        from: process.env.MAIL_CONFIG_USER,
        to: useCustomEmail === "true" ? customEmail : company.email,
        subject: "Boleto TakeBack",
        text: message,
      },
      (error, info) => {
        if (error) {
          return process.exit(1);
        }

        transporter.close();
      }
    );

    const paymentOrderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Aguardando pagamento" },
    });

    const updatedPaymentOrder = await getRepository(PaymentOrder).update(
      paymentOrderId,
      {
        pixKey,
        status: paymentOrderStatus,
      }
    );

    if (updatedPaymentOrder.affected === 0) {
      throw new InternalError(
        "Ouve um erro ao atualizar o status da ordem de pagamento",
        400
      );
    }

    return "Email enviado";
  }
}

export { SendPixToEmailUseCase };
