import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Principal} from "../Servicios/principal.service";


@Injectable({providedIn: 'root'})
export class UsuarioGuard implements CanActivate {
    constructor(private principal: Principal, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.principal.hasAnyAuthority(["Administrador", "Usuario"]).then(authenticated => {
            if (authenticated) {
                return Promise.resolve(authenticated);
            } else {
                this.router.navigate(["/login"]);
                return Promise.resolve(false);
            }
        });
    }
}
