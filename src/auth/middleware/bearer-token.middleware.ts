import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { envVariablesKeys } from '../../common/const/env.const';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    // ['Basic' , 'token']
    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    return token;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      next();
      return;
    }

    try {
      const token = this.validateBearerToken(authHeader);

      const decodedToken = this.jwtService.decode(token);
      if (decodedToken.type !== 'refresh' && decodedToken.type !== 'access') {
        throw new BadRequestException('잘못된 토큰입니다.');
      }

      const secretKey =
        decodedToken.type === 'refresh'
          ? envVariablesKeys.refreshTokenSecret
          : envVariablesKeys.accessTokenSecret;

      req.user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(secretKey),
      });
      next();
    } catch (e) {
      next();
    }
  }
}
