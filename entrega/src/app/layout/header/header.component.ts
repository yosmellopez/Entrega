import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {AccountService} from '../../guards/account.service';
import {SolicitudComponent} from '../../admin/solicitud/solicitud.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    solicitud: SolicitudComponent;
    searchOpen: boolean = false;
    mobileQuery: MediaQueryList;
    token = '';

    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private acount: AccountService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('load', this._mobileQueryListener);
        this.token = localStorage.getItem('user_token');
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeEventListener('load', this._mobileQueryListener);
    }

    logout() {
        this.acount.logout();
    }


}
