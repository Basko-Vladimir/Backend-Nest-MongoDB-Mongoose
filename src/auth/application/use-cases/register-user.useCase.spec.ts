import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RegisterUserCommand,
  RegisterUserUseCase,
} from './register-user.useCase';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { User, userSchema } from '../../../users/schemas/user.schema';
import { EmailManager } from '../../../common/managers/email.manager';
import { EmailAdapter } from '../../../common/adapters/email.adapter';
import { QueryAdminUsersRepository } from '../../../users/infrastructure/query-admin-users-repository.service';
import {
  EmailManagerMock,
  emailAdapterMock,
  users,
} from '../../../../test/mockData';

describe('Register user useCase', () => {
  let app: TestingModule;
  let registerUserUseCase: RegisterUserUseCase;
  let usersRepository: UsersRepository;
  let emailManager: EmailManager;

  const { correctCreateUserDtos } = users;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
        CqrsModule,
      ],
      providers: [
        { provide: EmailManager, useClass: EmailManagerMock },
        { provide: EmailAdapter, useValue: emailAdapterMock },
        UsersRepository,
        RegisterUserUseCase,
        QueryAdminUsersRepository,
        UsersRepository,
      ],
    }).compile();

    emailManager = app.get<EmailManager>(EmailManager);
    registerUserUseCase = app.get<RegisterUserUseCase>(RegisterUserUseCase);
    usersRepository = app.get<UsersRepository>(UsersRepository);
  });

  it('unconfirmed by default', async () => {
    const userId = await registerUserUseCase.execute(
      new RegisterUserCommand(correctCreateUserDtos[0]),
    );
    const dbUser = await usersRepository.findUserById(userId);

    expect(dbUser).not.toBeNull();
    expect(emailManager.formRegistrationEmail).toBeCalled();
    expect(dbUser.emailConfirmation.isConfirmed).toBe(false);
  });

  it('confirmed by default', async () => {
    const userId = await registerUserUseCase.execute(
      new RegisterUserCommand(correctCreateUserDtos[1], true),
    );
    const dbUser = await usersRepository.findUserById(userId);

    expect(dbUser).not.toBeNull();
    expect(emailManager.formRegistrationEmail).toBeCalled();
    expect(dbUser.emailConfirmation.isConfirmed).toBe(true);
  });
});
