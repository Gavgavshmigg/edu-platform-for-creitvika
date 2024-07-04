import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto, DeleteRoleDto, UpdateRoleDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role) private roleRepository: typeof Role,
        @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles
        ) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto);
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}});
        return role;
    }

    async getAllRoles() {
        const roles = await this.roleRepository.findAll();
        return roles;
    }

    async deleteRole(dto: DeleteRoleDto) {
        const role = await this.roleRepository.findOne({where: {value: dto.value}});
        if (role && !role.isNessessory) {
            await this.userRolesRepository.destroy({where: {id: role.id}});
            await this.roleRepository.destroy({where: {id: role.id}});
            return dto;
        }

        throw new HttpException('Роль не найдена или недоступна для удаления', HttpStatus.NOT_FOUND);
    }

    async updateRole(dto: UpdateRoleDto, value: string) {
        const role = await this.roleRepository.update(dto, {where: {value}});
        if (role[0] > 0) {
            return dto;
        }

        throw new HttpException('Роль не найдена', HttpStatus.NOT_FOUND);
    }
}
