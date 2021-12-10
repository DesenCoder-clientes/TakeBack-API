import { getRepository } from "typeorm";

interface Props {
  token: string;
}

class VerifyToken {
  async verifyIfTokenIsValid() {
    return false;
  }
}

export { VerifyToken };
