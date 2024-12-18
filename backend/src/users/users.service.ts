import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login-dto';
import { randomBytes } from 'crypto';
import { UserType } from '@prisma/client';
import { emit } from 'process';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPw = await argon2.hash(createUserDto.password);
    const newUser = await this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPw,
        type: createUserDto.type || UserType.customer,
      }
    });
    delete newUser.password;
    return newUser;
  }

  async login(loginData: LoginDto) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        email: loginData.email
      }
    });
    if (await argon2.verify(await user.password, loginData.password)) {
      const token = randomBytes(32).toString('hex');
      await this.db.token.create({
        data: {
          token,
          user: {
            connect: { id: user.id }
          }
        }
      });
      return {
        username: user.username,
        email: user.email,
        type: user.type,
        token: token,
        userId: user.id
      };
    } else {
      throw new Error('Invalid password');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.db.user.findUnique({
      where: {id}
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashedPw = await argon2.hash(updateUserDto.password);
    return this.db.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPw,
      },
    });
}


  remove(id: number) {
    return this.db.user.delete({
      where: {id}
    });
  }

  async findUserByToken(token: string){
    const tokenData = await this.db.token.findUniqueOrThrow({
      where: {token}, include: {user: true}
    })
    if (!tokenData){
      return null;
    }
    const user = tokenData.user;
    delete user.password;

    return user;
  }
}
