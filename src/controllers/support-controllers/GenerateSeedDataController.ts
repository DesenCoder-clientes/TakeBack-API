import { getRepository } from 'typeorm'
import { Request, Response } from 'express'

import { State } from '../../models/State'
import { City } from '../../models/City'

import { ConsumerAddress } from '../../models/ConsumerAddress'
import { TransactionTypes } from '../../models/TransactionType'
import { TransactionStatus } from '../../models/TransactionStatus'

import { StatesSeed } from '../../database/seeds/states.seed'
import { TransactionTypesSeed } from '../../database/seeds/transactionTypes.seed'
import { TransactionStatusSeed } from '../../database/seeds/transactionStatus.seed'

export const GenerateSeedDataController = async (request: Request, response: Response) => {
    try {
        const [states, count] = await getRepository(State).findAndCount()

        if (count > 0) {
            return response.status(200).json({ message: 'Operação já executada' })
        }

        // Gerando os Estados
        const generetadStatesData = await getRepository(State).save(StatesSeed)

        const minas = await getRepository(State).findOne({
            where: {
                initials: 'MG'
            }
        })

        // Gerando a Cidade de Porteirinha
        const generatedCitiesData = await getRepository(City).save({
            name: 'Porteirinha',
            zipCode: '39520000',
            state: minas
        })

        // Gerando os Tipos de Transações
        const generatedTransactionTypes = await getRepository(TransactionTypes).save(TransactionTypesSeed)

        // Gerando os Status das Transações
        const generatedTransactionStatus = await getRepository(TransactionStatus).save(TransactionStatusSeed)
        
        return response.json({
            generetadStatesData,
            generatedCitiesData,
            generatedTransactionTypes,
            generatedTransactionStatus
        })
    } catch (error) {
        return response.json(error)
    }
}

export const FindAllClients = async (request: Request, response: Response) => {
    const clients = await getRepository(ConsumerAddress).find({
        relations: ['city']
    })

    return response.json(clients)
}