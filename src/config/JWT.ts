import * as jwt from 'jsonwebtoken'

export function generateToken(payload, privateKey, expiresIn) {
    const token = jwt.sign(payload, privateKey, {
        // algorithm: 'RS256', // This algorith require private key generate
        expiresIn
    })

    return token
}

// module.exports = {
//   async generate(payload, auth, expiresIn) {
//     const token = jwt.sign({ payload }, auth, {
//       expiresIn: expiresIn,
//     });

//     return token;
//   },

//   async verify(res, authHeader, hash) {
//     if (!authHeader)
//       return res.status(400).send({ error: "Token nao informado" });

//     const parts = authHeader.split(" ");

//     if (parts.length !== 2)
//       return res.status(400).send({ error: "Erro no Token" });

//     const [schema, token] = parts;

//     if (!/^Bearer$/i.test(schema))
//       return res.status(400).send({ error: "Token mau formado" });

//     const authPayload = jwt.verify(token, hash, (err, decoded) => {
//       if (err) return res.status(401).send({ error: "Token inválido" });

//       return decoded.payload;
//     });

//     return authPayload;
//   },
// };