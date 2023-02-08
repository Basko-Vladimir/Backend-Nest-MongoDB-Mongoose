import jwt, { JwtPayload } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

//TODO investigate need this declaration or not

// declare module "jsonwebtoken" {
//   export interface JwtPayload {
//     userId: string;
//     deviceId?: string;
//   }
// }

@Injectable()
export class JwtService {
  async createJWT(payload: JwtPayload, expiresIn: string): Promise<string> {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  async getTokenPayload(token: string): Promise<JwtPayload | null> {
    try {
      const result: JwtPayload = <JwtPayload>(
        jwt.verify(token, process.env.JWT_SECRET)
      );
      return result;
    } catch {
      return null;
    }
  }
}
