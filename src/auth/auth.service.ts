import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role, User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { envVariablesKeys } from '../common/const/env.const';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
    const basicSplit = rawToken.split(' ');

    // ['Basic' , 'token']
    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>(
          envVariablesKeys.refreshTokenSecret,
        ),
      });

      if (isRefreshToken) {
        if (payload.type !== 'refresh') {
          throw new BadRequestException('리프레시 토큰을 입력해주세요');
        }
      } else {
        if (payload.type !== 'access') {
          throw new BadRequestException('access 토큰을 입력 해주세요');
        }
      }

      return payload;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    // ['Basic' , 'token']
    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    //그냥 외워!!
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
    }

    const [email, password] = tokenSplit;

    return {
      email,
      password,
    };
  }

  /// rawToken => "Basic $token"
  async register(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new BadRequestException('이미 가입한 이메일 입니다.!!');
    }

    const hash = await bcrypt.hash(
      password,
      this.configService.get<number>(envVariablesKeys.hashRounds),
    );

    await this.userRepository.save({
      email,
      password: hash,
    });

    return this.userRepository.findOne({ where: { email: email } });
  }

  async issueToken(
    user: { id?: number; role: Role; sub?: number; type?: string },
    isRefreshToken: boolean,
  ) {
    const refreshTokenSecret = this.configService.get<string>(
      envVariablesKeys.refreshTokenSecret,
    );
    const accessTokenSecret = this.configService.get<string>(
      envVariablesKeys.accessTokenSecret,
    );

    if (!isRefreshToken && user.type === 'access') {
      throw new BadRequestException('refresh Token을 입력해주세요.');
    }

    return await this.jwtService.signAsync(
      {
        sub: user.id || user.sub,
        role: user.role,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
        expiresIn: isRefreshToken ? '24h' : 300,
      },
    );
  }

  async authenticate(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('잘못된 로그인 정보입니다.');
    }

    const passOk = await bcrypt.compare(password, user.password);

    if (!passOk) {
      throw new BadRequestException('잘못된 로그인 정보입니다.');
    }

    return user;
  }

  async login(rawToken: string) {
    const { email, password } = this.parseBasicToken(rawToken);

    const user = await this.authenticate(email, password);

    return {
      refreshToken: await this.issueToken(user, true),
      accessToken: await this.issueToken(user, false),
    };
  }
}
