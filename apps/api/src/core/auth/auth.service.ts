import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordHasher } from '@erp/auth';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase().trim() },
      include: {
        tenant: true,
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(`Account is not active (status: ${user.status})`);
    }

    const isMatch = await PasswordHasher.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Extract roles and permissions
    const roles: string[] = [];
    const permissions: string[] = [];

    for (const ur of user.roles) {
      roles.push(ur.role.name);
      for (const rp of ur.role.permissions) {
        permissions.push(`${rp.permission.module}.${rp.permission.resource}.${rp.permission.action}`);
      }
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      roles,
      permissions,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, tenantId: user.tenantId },
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        tenantName: user.tenant.name,
        roles,
        permissions,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return PasswordHasher.hash(password);
  }
}
