import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
//import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  // instead of declaring the service is where and how
  // simply mention it in auth controller
  // const service = new AuthService()
  // avoid doing it that who manages it and who create it we use dependency injection like in controller

  async login(dto: AuthDto) {
    // Step 1: Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Step 2: If user not found, throw error
    if (!user) throw new ForbiddenException('User not found');

    // compare password now
    const pwMatches = await argon2.verify(user.password, dto.password);

    // Step 4: If password is incorrect, throw error
    if (!pwMatches) {
      throw new ForbiddenException('Invalid password');
    }

    // Step 4: Return the user
    return user;
  }

  async register(dto: AuthDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: dto.password,
          email: dto.email,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
      throw error;
    }
  }
}

// 1. gaurd me daal dena enum ko
// 2. verify -  logout, login, register
// 3. document upload, delete, update,  read --------- isi main role based wala part
// 4. role based access control document table id path name link with user
// 5. testing & ingestion sandepten
