import * as jwt from 'jsonwebtoken'

export function generateToken(payload, privateKey, expiresIn) {
    const token = jwt.sign(payload, privateKey, {
        // algorithm: 'RS256', // This algorith require private key generate
        expiresIn
    })

    return token
}

export function verifyToken(authHeader, hash) {
    if (!authHeader) return new Error('Token nao informado')
    
    const parts = authHeader.split(" ")

    if (parts.length !== 2) return new Error('Erro no Token')

    const [schema, token] = parts

    if (!/^Bearer$/i.test(schema)) return new Error('Token mau formado')

    const authPayload = jwt.verify(token, hash, (err, decoded) => {
        if (err) return new Error('Token inválido')

        return decoded.payload
    })

    return authPayload
}
