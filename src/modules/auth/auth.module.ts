import { Module } from '@nestjs/common';
import RegistrationController from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import appConfig from '../../../config/auth.config';
import { Repository } from 'typeorm';
import AuthenticationService from './auth.service';
import UserService from '../user/user.service';
import { OtpModule } from '../otp/otp.module';
import { EmailModule } from '../email/email.module';
import { OtpService } from '../otp/otp.service';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [RegistrationController],
  providers: [AuthenticationService, Repository, UserService, OtpService, EmailService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    OtpModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: appConfig().jwtSecret,
      signOptions: { expiresIn: `${appConfig().jwtExpiry}s` },
    }),
  ],
})
export class AuthModule {}
