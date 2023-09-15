import { UserRepository } from './../user/repositories/user.repository';
import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { RegisterUserDto } from './auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@purple-miroservices/interfaces';
import { User } from '../user/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        await this.validateRegisterUserDto(registerUserDto);

        const newUserEntity = await new UserEntity({
            ...registerUserDto,
            role: UserRole.Student,
            passwordHash: '',
        }).setPassword(registerUserDto.password);

        const newUser = await this.userRepository.create(newUserEntity as unknown as User)
        return {email: newUser.email};
    }

    private async validateRegisterUserDto(registerUserDto: RegisterUserDto) {
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
        return {
            access_token: await this.jwtService.signAsync({id})
        }
    }
}
