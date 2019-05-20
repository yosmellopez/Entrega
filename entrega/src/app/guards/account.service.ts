import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { SERVER_URL } from '../contantes';
import { Usuario } from '../modelo';
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class AccountService {
    private userIdentity: any;
    private authenticated = false;
    private authenticationState = new Subject<any>();
    token = '';

    constructor(private http: HttpClient, private router: Router) {
        this.token = localStorage.getItem('user_token');

    }

    fetch(): Observable<HttpResponse<Usuario>> {
        return this.http.get<Usuario>(SERVER_URL + 'api/account', {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    save(account: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_URL + 'api/account', account, {observe: 'response'});
    }

    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    hasAnyAuthority(authorities: string[]): boolean {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.rol) {
            return false;
        }

        for (let i = 0; i < authorities.length; i++) {
            const rol = this.userIdentity.rol;
            if (rol.name === authorities[i]) {
                return true;
            }
        }
        return false;
    }

    hasAuthority(authority: string): Promise<boolean> {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }

        return this.identity().then(
            id => {
                const roles: any[] = id.authorities || [];
                return Promise.resolve(roles.map(value => value.name).includes(authority));
            },
            () => {
                return Promise.resolve(false);
            }
        );
    }

    identity(force?: boolean): Promise<any> {
        if (force) {
            this.userIdentity = undefined;
        }

        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity) {
            return Promise.resolve(this.userIdentity);
        }

        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        return this.fetch()
            .toPromise()
            .then(response => {
                const account = response.body;
                if (account) {
                    this.userIdentity = account;
                    this.authenticated = true;
                    // After retrieve the account info, the language will be changed to
                    // the user's preferred language configured in the account setting
                } else {
                    this.userIdentity = null;
                    this.authenticated = false;
                }
                this.authenticated = true;
                this.authenticationState.next(this.userIdentity);
                return this.userIdentity;
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

    subscribeToMailList(email: string): Observable<HttpResponse<any>> {
        return this.http.post<any>(SERVER_URL + 'api/mailLists', {email: email}, {observe: 'response'});
    }

    unsubscribeToMailList(email: string): Observable<HttpResponse<any>> {
        return this.http.delete(SERVER_URL + `api/mailLists`, {params: {email: email}, observe: 'response'});
    }

    logout(): void {
        this.userIdentity = null;
        this.authenticated = false;
        this.authenticationState.next(this.userIdentity);
        this.router.navigate(['/login'])

    }
}
