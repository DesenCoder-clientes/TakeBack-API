import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { City } from '../../models/City'

export const getAllCities = async (request: Request, response: Response) => {
    try {
        const cities = await getRepository(City).find()

        return response.status(200).json(cities)
    } catch (error) {
        return response.status(500).send(error)
    }
}
