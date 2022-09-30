import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRole } from '@microservices/interfaces';

import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { RegisterDto } from './auth.controller';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async register({
        email,
        password,
        displayName,
    }: RegisterDto): Promise<{ email: string }> {
        const oldUser = await this.userRepository.findUser(email);
        if (oldUser) throw new Error('User Exist');
        const newUserEntity = await new UserEntity({
            displayName,
            email,
            passwordHash: '',
            role: UserRole.Student,
        }).setPassword(password);
        const newUser = await this.userRepository.createUser(newUserEntity);
        return { email: newUser.email };
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<{ id: string }> {
        const user = await this.userRepository.findUser(email);
        if (!user) throw new Error('Wrong Login/Password');
        const userEntity = new UserEntity(user);
        const isCorrectPassword = await userEntity.validatePassword(password);
        if (!isCorrectPassword) throw new Error('Wrong Login/Password');
        return { id: user._id };
    }

    async login(id: string): Promise<{ accessToken: string }> {
        return {
            accessToken: await this.jwtService.signAsync({ id }),
        };
    }
}
