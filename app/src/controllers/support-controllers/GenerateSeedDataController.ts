import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { State } from '../../models/State'
import { City } from '../../models/City'

import { StatesSeed } from '../../database/seeds/states.seed'
import { ClientAddress } from '../../models/ClientAddress'

export const GenerateSeedDataController = async (request: Request, response: Response) => {
    try {
        const generetadStatesData = await getRepository(State).save(StatesSeed)

        const minas = await getRepository(State).findOne({
            where: {
                initials: 'MG'
            }
        })

        const generatedCitiesData = await getRepository(City).save({
            name: 'Porteirinha',
            zipCode: '39520000',
            state: minas
        })

        return response.json({ generetadStatesData, generatedCitiesData })
    } catch (error) {
        return response.json(error)
    }
}

export const FindAllClients = async (request: Request, response: Response) => {
    const clients = await getRepository(ClientAddress).find({
        relations: ['city']
    })

    return response.json(clients)
}