import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { usersConstants } from '../../common/constants';
import {
  generateLengthErrorMessage,
  generateRegExpError,
} from '../../common/error-messages';
import { CreateUserDto } from '../dto/create-user.dto';
import { HydratedDocument, Model, now } from 'mongoose';

const {
  MIN_LOGIN_LENGTH,
  MAX_LOGIN_LENGTH,
  LOGIN_REG_EXP,
  EMAIL_REG_EXP,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} = usersConstants;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      MIN_LOGIN_LENGTH,
      generateLengthErrorMessage('login', MIN_LOGIN_LENGTH, 'min'),
    ],
    maxlength: [
      MAX_LOGIN_LENGTH,
      generateLengthErrorMessage('login', MAX_LOGIN_LENGTH, 'max'),
    ],
    validate: [LOGIN_REG_EXP, generateRegExpError('login', LOGIN_REG_EXP)],
  })
  login: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    validate: [EMAIL_REG_EXP, generateRegExpError('email', EMAIL_REG_EXP)],
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      MIN_PASSWORD_LENGTH,
      generateLengthErrorMessage('password', MIN_PASSWORD_LENGTH, 'min'),
    ],
    maxlength: [
      MAX_PASSWORD_LENGTH,
      generateLengthErrorMessage('password', MAX_PASSWORD_LENGTH, 'max'),
    ],
  })
  password: string;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;

  static createUserEntity(
    createUserDto: CreateUserDto,
    UserModel: UserModelType,
  ): UserDocument {
    return new UserModel(createUserDto);
  }
}

export type UserDocument = HydratedDocument<User>;

export interface IUsersStaticMethods {
  createUserEntity(
    createUserDto: CreateUserDto,
    UserModel: UserModelType,
  ): UserDocument;
}

export type UserModelType = Model<User> & IUsersStaticMethods;

export const userSchema = SchemaFactory.createForClass(User);

userSchema.static('createUserEntity', User.createUserEntity);
