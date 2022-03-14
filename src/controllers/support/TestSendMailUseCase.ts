import { Response } from "express";
import transporter from "../../config/SMTP";
import { sendMail } from "../../utils/SendMail";

export const TestSendMailUseCase = (response: Response) => {
  try {
    var mailList = ["wesleyleandro.dev@gmail.com", "izaquenunes560@gmail.com"];

    transporter.sendMail(
      {
        from: process.env.MAIL_CONFIG_USER,
        to: "wesleyleandro.dev@gmail.com",
        subject: "Boleto TakeBack",
        text: "Teste de envio de emails",
      },
      (error, info) => {
        if (error) {
          return process.exit(1);
        }

        transporter.close();
      }
    );

    return response.status(200).json({ msg: "Success" });
  } catch (error) {
    return response.json(error);
  }
};
