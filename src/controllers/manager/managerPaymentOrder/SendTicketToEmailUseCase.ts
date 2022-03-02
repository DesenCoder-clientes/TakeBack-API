import { InternalError } from "../../../config/GenerateErros";
import transporter from "../../../config/SMTP";

interface Props {
  fileName: string;
  filePath: string;
  useCustomEmail: boolean;
  customEmail: string;
}

class SendTicketToEmailUseCase {
  async execute({ fileName, filePath, useCustomEmail, customEmail }: Props) {
    transporter.sendMail(
      {
        from: process.env.MAIL_CONFIG_USER,
        to: customEmail,
        subject: "Boleto",
        text: "Segue o seu boleto para o pagamento dos cashbacks",
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      },
      (error, info) => {
        if (error) {
          return process.exit(1);
        }

        transporter.close();
      }
    );

    return "Sucesso";
  }
}

export { SendTicketToEmailUseCase };
