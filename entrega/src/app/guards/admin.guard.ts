import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { Injectable, isDevMode } from '@angular/core';
import { AccountService } from './account.service';
import {Information} from "../mensaje/window.mensaje";
import {MatDialog} from "@angular/material";

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {
    constructor(private dialog: MatDialog, private accountService: AccountService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        if (this.accountService.isAuthenticated()){
            const authorities = route.data['roles'];
            // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
            // that the client has a principal too, if they already logged in by the server.
            // This could happen on a page refresh.
            return this.checkLogin(authorities);
        } else {
            this.dialog.open(Information, {
                width: '400px',
                data: {mensaje: 'Aun no se ha registrado en el sistema para acceder a esta ruta.'}
            });
            this.router.navigate(['/login']);
        }
    }

    checkLogin(authorities: string[]): Promise<boolean> {
        return this.accountService.identity().then(account => {
            if (!authorities || authorities.length === 0) {
                return true;
            }

            if (account) {
                const hasAnyAuthority = this.accountService.hasAnyAuthority(authorities);
                if (hasAnyAuthority) {
                    return true;
                }
                if (isDevMode()) {
                    console.error('User has not any of required authorities: ', authorities);
                }
                this.router.navigate(['/login']);
                return false;
            }
            this.router.navigate(['/login']);
            return false;
        });
    }
}
