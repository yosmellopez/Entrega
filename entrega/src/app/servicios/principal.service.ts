import {Injectable} from '@angular/core';
import {AccountService} from "./account.service";
import {Observable, Subject} from "rxjs/index";
import {Usuario} from "../modelo";

@Injectable({providedIn: 'root'})
export class Principal {
    private userIdentity: any;
    private authenticated = false;
    public authenticationState = new Subject<any>();

    constructor(private account: AccountService) {
    }

    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    hasAnyAuthority(authorities: string[]): Promise<boolean> {
        return this.hasAnyAuthorityDirect(authorities);
    }

    hasAnyAuthorityDirect(authorities: string[]): Promise<boolean> {
        return this.identity().then(
            (usuario: Usuario) => {
                if (!usuario) {
                    return Promise.resolve(false);
                }
                for (let i = 0; i < authorities.length; i++) {
                    if (usuario.rol.name == authorities[i]) {
                        return Promise.resolve(true);
                    }
                }
                return Promise.resolve(false);
            },
            () => {
                return Promise.resolve(false);
            }
        );


    }

    hasAuthority(authority: string): Promise<boolean> {
        return this.identity().then(
            (usuario: Usuario) => {
                if (usuario) {
                    return Promise.resolve(usuario.rol && usuario.rol.name === authority);
                } else
                    return Promise.resolve(false);
            },
            () => {
                return Promise.resolve(false);
            }
        );
    }

    identity(force?: boolean): Promise<any> {
        if (force === true) {
            this.userIdentity = undefined;
        }
        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            this.authenticationState.next(this.userIdentity);
            return Promise.resolve(this.userIdentity);
        }
        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        return this.account
            .get()
            .toPromise()
            .then(response => {
                if (response.body.success) {
                    const account = response.body.elemento;
                    if (account) {
                        this.userIdentity = account;
                        this.authenticated = true;
                    } else {
                        this.userIdentity = null;
                        this.authenticated = false;
                    }
                    this.authenticationState.next(this.userIdentity);
                    return this.userIdentity;
                } else {
                    this.userIdentity = null;
                    this.authenticated = false;
                    this.authenticationState.next(this.userIdentity);
                    return null;
                }
            })
            .catch(err => {
                this.userIdentity = null;
                this.authenticated = false;
                this.authenticationState.next(this.userIdentity);
                return null;
            });
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    isIdentityResolved(): boolean {
        return this.userIdentity !== undefined;
    }

    getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }

    getImageUrl(): string {
        return this.isIdentityResolved() ? this.userIdentity.imageUrl : null;
    }

    logout() {
        this.userIdentity = null;
        this.authenticated = false;
        this.authenticationState.next(false);
    }
}
