import {Injectable, isDevMode} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from "./account.service";
import {MatDialog} from "@angular/material";
import {Information} from "../mensaje/window.mensaje";

@Injectable({
  providedIn: 'root'
})
export class RegistradorGuard implements CanActivate  {
    private loginModalService: any;

    constructor(private dialog: MatDialog, private router: Router, private accountService: AccountService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        if (this.accountService.isAuthenticated()){
            const authorities = route.data['roles'];
            // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
            // that the client has a principal too, if they already logged in by the server.
            // This could happen on a page refresh.
            return this.checkLogin(authorities, state.url);
        } else {
            this.dialog.open(Information, {
                width: '400px',
                data: {mensaje: 'Aun no se ha registrado en el sistema para acceder a esta ruta.'}
            });
            this.router.navigate(['/login']);
        }
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        return this.accountService.identity().then(account => {
            console.log(account);
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
                return false;
            }

            this.router.navigate(['accessdenied']).then(() => {
                // only show the login dialog, if the user hasn't logged in yet
                if (!account) {
                    this.loginModalService.open();
                }
            });
            return false;
        });
    }

}
