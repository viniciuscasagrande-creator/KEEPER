import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Core - Users')
@ApiBearerAuth()
@Controller('core/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('core.users.criar')
  @ApiOperation({ summary: 'Create a new user within tenant' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(tenantId, dto);
  }

  @Get()
  @RequirePermissions('core.users.visualizar')
  @ApiOperation({ summary: 'List all users in the tenant' })
  async list(@CurrentTenant() tenantId: string) {
    return this.usersService.listByTenant(tenantId);
  }

  @Get(':id')
  @RequirePermissions('core.users.visualizar')
  @ApiOperation({ summary: 'Get user details by ID' })
  async getById(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.findById(tenantId, id);
  }
}
