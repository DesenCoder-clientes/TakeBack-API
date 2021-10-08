import { Response } from "express"
import { sendMail } from "../../utils/SendMail"

export const TestSendMail = (response: Response) => {
    try {
        sendMail(
            'administrativo@desencoder.com.br',
            'Take Back',
            'Hello Take Back'
        )

        return response.status(200).json({ msg: 'Success' })
    } catch (error) {
        return response.json(error)
    }
}