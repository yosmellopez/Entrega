import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Principal} from "../Servicios/principal.service";

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

    constructor(private principal: Principal, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.principal.hasAuthority("Administrador").then(authenticated => {
            if (authenticated) {
                return Promise.resolve(authenticated);
            } else {
                this.router.navigate(["/login"]);
                return Promise.resolve(false);
            }
        });
    }
}
