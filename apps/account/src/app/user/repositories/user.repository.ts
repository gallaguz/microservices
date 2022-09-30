import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UserEntity } from '../entities/user.entity';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}

    async createUser(
        user: UserEntity,
    ): Promise<User & { _id: Types.ObjectId }> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    async findUser(email: string): Promise<User & { _id: Types.ObjectId }> {
        return this.userModel.findOne({ email }).exec();
    }

    async deleteUser(email: string): Promise<void> {
        await this.userModel.deleteOne({ email }).exec();
    }
}
