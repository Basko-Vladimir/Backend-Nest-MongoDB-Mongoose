import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
  UserModelType,
} from '../users/schemas/user.schema';
import { UsersRepository } from '../users/users.repository';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailManager } from '../common/managers/email.manager';
import { LoginUserDto } from './dto/login-user.dto';
import { validateOrRejectInputDto } from '../common/utils';
import { JwtService } from './jwt.service';
import {
  ACCESS_TOKEN_LIFE_TIME,
  REFRESH_TOKEN_LIFE_TIME,
} from '../common/constants';
import { ITokensPair } from '../common/types';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { EmailDto } from './dto/email.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import {
  DeviceSession,
  DeviceSessionDocument,
} from '../devices-sessions/schemas/device-session.schema';
import { DevicesSessionsService } from '../devices-sessions/devices-sessions.service';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailManager: EmailManager,
    protected jwtService: JwtService,
    protected devicesSessionsService: DevicesSessionsService,
    @InjectModel(User.name) protected UserModel: UserModelType,
  ) {}

  async registerUser(
    createUserDto: CreateUserDto,
    isConfirmedByDefault?: boolean,
  ): Promise<string> {
    // await validateOrRejectInputDto(createUserDto, CreateUserDto);

    const { password } = createUserDto;
    const passwordHash = await AuthService.generatePasswordHash(password);
    const createdUser = await this.UserModel.createUserEntity(
      createUserDto,
      passwordHash,
      isConfirmedByDefault,
      this.UserModel,
    );
    const savedUser = await this.usersRepository.saveUser(createdUser);
    const savedUserId = String(savedUser._id);

    try {
      await this.emailManager.sendRegistrationEmail(createdUser);
      return savedUserId;
    } catch (error) {
      await this.usersRepository.deleteUser(savedUserId);
      throw new Error(error);
    }
  }

  async confirmRegistration(
    confirmRegistrationDto: ConfirmRegistrationDto,
    user: UserDocument,
  ): Promise<void> {
    // await validateOrRejectInputDto(
    //   confirmRegistrationDto,
    //   ConfirmRegistrationDto,
    // );

    const confirmedUser = user.confirmUserRegistration(user);
    await this.usersRepository.saveUser(confirmedUser);
  }

  async resendRegistrationEmail(
    emailDto: EmailDto,
    user: UserDocument,
  ): Promise<void> {
    // await validateOrRejectInputDto(
    //   resendEmailRegistrationDto,
    //   ResendEmailRegistrationDto,
    // );

    const changedUser = user.updateConfirmationCode(user);
    const savedUser = await this.usersRepository.saveUser(changedUser);

    await this.emailManager.sendRegistrationEmail(savedUser);
  }

  async login(
    loginUserDto: LoginUserDto,
    ip: string,
    userAgent: string,
  ): Promise<ITokensPair> {
    // await validateOrRejectInputDto(loginUserDto, LoginUserDto);

    const { loginOrEmail, password } = loginUserDto;
    const userId = await this.checkCredentials(loginOrEmail, password);

    if (!userId) throw new UnauthorizedException();

    const deviceId = uuidv4();
    const { accessToken, refreshToken } = await this.createNewTokensPair(
      { userId },
      ACCESS_TOKEN_LIFE_TIME,
      { userId, deviceId },
      REFRESH_TOKEN_LIFE_TIME,
    );
    const refreshTokenPayload = await this.jwtService.getTokenPayload(
      refreshToken,
    );

    if (!refreshTokenPayload) {
      throw new Error(`Couldn't get payload from refresh token!`);
    }

    const deviceSessionData: Partial<DeviceSession> = {
      issuedAt: refreshTokenPayload.iat,
      expiredDate: refreshTokenPayload.exp,
      deviceId: refreshTokenPayload.deviceId,
      deviceName: userAgent,
      ip,
      userId: new Types.ObjectId(userId),
    };

    await this.devicesSessionsService.createDeviceSession(deviceSessionData);

    return { accessToken, refreshToken };
  }

  async recoverPassword(emailDto: EmailDto): Promise<void> {
    const { email } = emailDto;
    const targetUser = await this.usersRepository.findUserByFilter({ email });
    const updatedUser = targetUser.updatePasswordRecoveryCode(targetUser);
    const savedUser = await this.usersRepository.saveUser(updatedUser);

    try {
      return this.emailManager.recoverPassword(
        email,
        savedUser.passwordRecoveryCode,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async setNewPassword(
    setNewPasswordDto: SetNewPasswordDto,
    user: UserDocument,
  ): Promise<void> {
    const { newPassword, recoveryCode } = setNewPasswordDto;
    const newHash = await AuthService.generatePasswordHash(newPassword);

    const updatedUser = await user.updatePassword(user, newHash, recoveryCode);
    await this.usersRepository.saveUser(updatedUser);
  }

  async refreshTokens(
    userId: string,
    session: DeviceSessionDocument,
  ): Promise<ITokensPair> {
    const { accessToken, refreshToken } = await this.createNewTokensPair(
      { userId },
      ACCESS_TOKEN_LIFE_TIME,
      { userId, deviceId: session.deviceId },
      REFRESH_TOKEN_LIFE_TIME,
    );
    const refreshTokenPayload = await this.jwtService.getTokenPayload(
      refreshToken,
    );

    if (!refreshTokenPayload) {
      throw new Error(`Couldn't get payload from refresh token!`);
    }

    await this.devicesSessionsService.updateDeviceSessionData(
      session,
      refreshTokenPayload.iat,
    );

    return { accessToken, refreshToken };
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<string | null> {
    const user = await this.usersRepository.findUserByFilter({
      login: loginOrEmail,
      email: loginOrEmail,
    });

    if (!user) return null;

    const isMatchedUser = await bcrypt.compare(password, user.passwordHash);

    return isMatchedUser ? String(user._id) : null;
  }

  static async generatePasswordHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, passwordSalt);
  }

  private async createNewTokensPair(
    accessTokenPayload: JwtPayload,
    accessTokenLifetime: string,
    refreshTokenPayload: JwtPayload,
    refreshTokenLifetime: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.createJWT(
      { ...accessTokenPayload, iat: Date.now() },
      accessTokenLifetime,
    );
    const refreshToken = await this.jwtService.createJWT(
      { ...refreshTokenPayload, iat: Date.now() },
      refreshTokenLifetime,
    );

    return { accessToken, refreshToken };
  }
}
