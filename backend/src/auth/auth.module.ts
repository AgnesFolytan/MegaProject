import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { tokenStrategy } from './token.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, tokenStrategy]
})
export class AuthModule {}
