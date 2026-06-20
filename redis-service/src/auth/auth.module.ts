import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import {RedisModule} from "../redis-service/redis-module";
import {AuthController} from "./auth.controller";


@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
      RedisModule
  ],

  providers: [
    AuthService,
  ],
  controllers:[AuthController],

  exports: [
    JwtModule,
  ],
})
export class AuthModule {}