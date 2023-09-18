import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { UserCommands } from './user.commands';
import { UserQueries } from './user.queries';

@Module({
  providers: [UserRepository],
  controllers: [UserCommands, UserQueries],
  imports: [MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema
    },
  ])],
  exports: [UserRepository]
})
export class UserModule {}
