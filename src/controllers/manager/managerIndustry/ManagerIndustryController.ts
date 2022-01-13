import { Request, response, Response } from "express";
import { FindIndustryUseCase } from "./FindIndustryUseCase";
import { RegisterIndustryUseCase } from "./RegisterIndustryUseCase";
import { UpdateIndustryUseCase } from "./UpdateIndustryUseCase";

interface Props{
    description: string
    categoryFee: number
}

class ManagerIndustryController{
    async registerIndustry(request: Request, response: Response){
        const {description, categoryFee}: Props = request.body;

        const registerIndustry = new RegisterIndustryUseCase();

        const result = await registerIndustry.execute({categoryFee, description});

        response.status(201).json(result)
    }

    async updateIndustry(request: Request, response: Response){
        const id = request.params.id;
        const {description, categoryFee} : Props = request.body;

        const update = new UpdateIndustryUseCase();

        const result = await update.execute({
            description,
            categoryFee,
            id
        })

        return response.status(200).json(result);
    }

    async findIndustry(request: Request, response: Response){
    const findIndustries = new FindIndustryUseCase();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
}

}

export {ManagerIndustryController};
