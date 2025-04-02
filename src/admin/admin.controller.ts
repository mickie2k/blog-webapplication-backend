import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JWTAuthGuard } from 'src/auth/guards/jwt_auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Roles(Role.ADMIN)
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('info')
  getAllInformation() {
    return this.adminService.getAllInfo();
  }

  @Get('user')
  findAllUser() {
    return this.adminService.findAllUser(); 
  }

  @Get('blog')
  findAllBlog() {
    return this.adminService.findAllBlog();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}