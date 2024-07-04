import { ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class RolesAccessGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride('roles', [
                context.getHandler(),
                context.getClass()
            ]);
    
            if (!requiredRoles) return true;
            
            const req = context.switchToHttp().getRequest();
            const user = req.user;
    
            return user.roles.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }
        
    }
    
}