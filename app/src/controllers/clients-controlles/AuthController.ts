import { getRepository } from 'typeorm'
import { Request, Response } from 'express'
import axios from 'axios'
import * as bcrypt from 'bcrypt'

import { Client } from '../../models/Client'
import { ClientAddress } from '../../models/ClientAddress'
import { City } from '../../models/City'

import { convertDate } from '../../utils/ConvertDateToISOString'
import { CPFValidate } from '../../utils/CPFValidate'
import { generateRandomNumber } from '../../utils/RandomValueGenerate'
import { sendMail } from '../../utils/SendMail'
import { generateToken } from '../../config/JWT'
import { State } from '../../models/State'

type loginTypes = {
    cpf: string
    password: string
    remember: boolean
}

type userDataTypes = {
    id: string
    fullName: string
    cpf: string
    birthDate: string
    email: string
    phone: string
    zipCode: string
    password: string
}

type confirmationEmailTypes = {
    id: string
    confirmation: string
}

type data = {
    cep: string
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    ibge: string
    gia: string
    ddd: string
    siafi: string
}

type apiCorreiosResponseType = {
    data: data
}

export const signIn = async (request: Request, response: Response) => {
    try {
        const { cpf, password }: loginTypes = request.body

        if (!cpf || !password) {
            return response.status(401).json({ message: 'Dados incompletos' })
        }

        const client = await getRepository(Client).findOne({
            where: {
                cpf
            }
        })

        if (!client) {
            return response.status(404).json({ message: 'CPF não cadastrado' })
        }

        const passwordMatch = await bcrypt.compare(password, client.password)

        if (!passwordMatch) {
            return response.status(401).json({ message: 'Senha incorreta' })
        }

        const PAYLOAD = {
            id: client.id,
            name: client.fullName,
            email: client.email,
            cpf: client.cpf,
            phone: client.phone
        }

        const EXPIRES_IN = 60 * 60 * 24

        const token = generateToken(PAYLOAD, process.env.JWT_CONFIG_AUTH_USER, EXPIRES_IN)

        return response.status(200).json({ ACCESS_TOKEN: token })
    } catch (error) {
        return response.status(400).json(error)
    }
}

export const registerNewClient = async (request: Request, response: Response) => {
    try {
        const {
            fullName,
            cpf,
            birthDate,
            email,
            phone,
            zipCode,
            password
        }: userDataTypes = request.body.userData

        if (!fullName || !birthDate || !phone || !zipCode || !email || !password) {
            return response.status(401).json({ message: 'Dados incompletos' })
        }

        if (!CPFValidate(cpf)) {
            return response.status(400).json({ message: 'CPF inválido' })
        }

        const client = await getRepository(Client).findOne({ where: { cpf } })

        if (client) {
            return response.status(302).json({ message: 'CPF já cadastrado' })
        }

        const city = await getRepository(City).findOne({
            where: {
                zipCode
            }
        })

        if (city) {
            var address = await getRepository(ClientAddress).save({
                city,
                street: '',
                district: '',
            })
        } else {
            var {
                data: {
                    bairro,
                    cep,
                    localidade,
                    logradouro,
                    uf
                }
            }: apiCorreiosResponseType = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`)

            const state = await getRepository(State).findOne({
                where: {
                    initials: uf
                }
            })

            const newCity = await getRepository(City).save({
                name: localidade,
                zipCode: cep,
                state
            })

            var newAddress = await getRepository(ClientAddress).save({
                city: newCity,
                street: logradouro,
                district: bairro,
            })
        }

        const passwordEncrypted = bcrypt.hashSync(password, 10)
        // const MIN = 100000
        // const MAX = 999999

        // const confirmEmail = `TB-${generateRandomNumber(MIN, MAX)}`

        const newClient = await getRepository(Client).save({
            fullName: fullName,
            birthDate: convertDate(birthDate),
            phone: phone,
            cpf: cpf,
            email: email,
            address: address ? address : newAddress,
            password: passwordEncrypted
        })

        // if (newClient) {
        //     const message = `Olá ${newClient.full_name}, já estamos quase lá! Para completar o seu cadastro, digite as seguintes credenciais ${confirmEmail}`
            
        //     sendMail(
        //         newClient.email,
        //         'Take Back - Confirmação de email',
        //         message
        //     )
        //     return response.status(201).json({ id: newClient.id })
        // }

        if (newClient) {
            return response.status(400).json({ token: 'TOKEN_DE_ACESSO' })
        }

        return response.status(400).json({ message: 'Houve um erro' })
    } catch (error) {
        return response.status(400).json(error)
    }
}

export const confirmationEmail = async (request: Request, response: Response) => {
    try {
        const { id, confirmation }: confirmationEmailTypes = request.body

        const client = await getRepository(Client).findOne(id)

        if (!client) {
            return response.status(404).json({ message: 'Usuário não encontrado' })
        }

        if (client.signature === confirmation) {
            const PAYLOAD = {
                id: client.id,
                name: client.fullName,
                email: client.email,
                cpf: client.cpf,
                phone: client.phone
            }

            const EXPIRES_IN = 60 * 60 * 24

            const token = generateToken(PAYLOAD, process.env.JWT_CONFIG_AUTH_USER, EXPIRES_IN)

            return response.status(200).json({ ACCESS_TOKEN: token })
        }

        return response.status(401).json({ message: 'Confirmação inválida' })
    } catch (error) {
        return response.status(400).json(error)
    }
}