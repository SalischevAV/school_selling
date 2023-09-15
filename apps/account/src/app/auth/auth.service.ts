import { ConfigService } from '@nestjs/config';
import { UserRepository } from './../user/repositories/user.repository';
import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@purple-miroservices/interfaces';
import { User } from '../user/models/user.model';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@purple-miroservices/contracts';

@Injectable()
export class AuthService {
    protected logger = new Logger(AuthService.name);
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerUserDto: AccountRegister.Request) {
        await this.validateRegisterUserDto(registerUserDto);

        const newUserEntity = await new UserEntity({
            ...registerUserDto,
            role: UserRole.Student,
            passwordHash: '',
        }).setPassword(registerUserDto.password);

        const newUser = await this.userRepository.create(newUserEntity as unknown as User)
        return {email: newUser.email};
    }

    private async validateRegisterUserDto(registerUserDto: AccountRegister.Request) {
        try {
            await this.userRepository.findOne({
                email: registerUserDto.email,
            });
        } catch (error) {
            return;
        }
    }

    async verifyUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
          throw new NotFoundException('User not found');
        }
        const userEntity = new UserEntity(user);
        const isPasswordValid = await userEntity.validatePassword(password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Credentials are not valid');
        }
        return userEntity;
      }

    async login(id: string) {
        try{
            return {
                access_token: await this.jwtService.signAsync({id})
            }
        } catch(error){
            this.logger.error((error as unknown as Error).message);
        }
    }
}
