import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AccountService } from './account.service';

@Injectable({providedIn: 'root'})
export class UserRouteAccessService implements CanActivate {
    private loginModalService: any;

    constructor(private router: Router, private accountService: AccountService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const authorities = route.data['roles'];
        // We need to call the checkLogin / and so the accountService.identity() function, to ensure,
        // that the client has a principal too, if they already logged in by the server.
        // This could happen on a page refresh.
        return this.checkLogin(authorities, state.url);
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
