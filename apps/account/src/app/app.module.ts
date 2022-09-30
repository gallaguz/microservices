import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { mongoConfig } from './configs/mongo.config';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'envs/.account.env',
        }),
        MongooseModule.forRootAsync(mongoConfig()),
        UserModule,
        AuthModule,
    ],
})
export class AppModule {}
