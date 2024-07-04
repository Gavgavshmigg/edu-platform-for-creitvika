import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from './dto';
import { ApiHeaders, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './roles.model';
import { Roles } from 'src/common/decorators';
import { RolesAccessGuard } from 'src/common/guards';
import { ValidationPipe } from 'src/common/pipes';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @ApiOperation({summary: "Создание роли"})
    @ApiResponse({status:201, type: Role})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateRoleDto) {
        return this.rolesService.createRole(dto);
    }

    @ApiOperation({summary: "Получение роли по уникальному значению"})
    @ApiResponse({status:200, type: Role})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Get('/:value')
    @HttpCode(HttpStatus.OK)
    getByValue(@Param('value') value: string) {
        return this.rolesService.getRoleByValue(value);
    }

    @ApiOperation({summary: "Получение списка всех ролей"})
    @ApiResponse({status:200, type: [Role]})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Get()
    @HttpCode(HttpStatus.OK)
    getAll() {
        return this.rolesService.getAllRoles();
    }

    @ApiOperation({summary: "Удаление роли"})
    @ApiResponse({status:200, description: "Успешно"})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Delete()
    @HttpCode(HttpStatus.OK)
    delete(@Body() dto: DeleteRoleDto) {
        return this.rolesService.deleteRole(dto);
    }

    @ApiOperation({summary: "Изменение роли"})
    @ApiResponse({status:200, type: UpdateRoleDto})
    @ApiHeaders([{name: "Authorization", description: "Требуется токен доступа в заголовке авторизации"}])
    @Roles("ADMIN")
    @UseGuards(RolesAccessGuard)
    @Put('/:value')
    @HttpCode(HttpStatus.OK)
    update(@Body() dto: UpdateRoleDto, @Param('value') value: string) {
        return this.rolesService.updateRole(dto, value);
    }
}
