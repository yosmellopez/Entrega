import {Component, OnInit} from '@angular/core';
import {RouteInfo, Usuario} from '../../modelo';
import {APP_RUTAS} from '../../app-routing';
import {AccountService} from '../../guards/account.service';

export declare function notify(message, type);

@Component({
    selector: 'app-centro',
    templateUrl: './centro.component.html',
    styleUrls: ['./centro.component.css']
})
export class CentroComponent implements OnInit {
    rutas: RouteInfo[] = APP_RUTAS;
    rutasUsuario: RouteInfo[] = []
    nameRol: string;
    username: string;
    isOpen: boolean;

    constructor(private accountService: AccountService) {
        this.isOpen = JSON.parse(sessionStorage.getItem('isOpen')) || false;
    }

    ngOnInit() {
        document.body.setAttribute('class', 'sw-toggled');
        //this.rutasUsuario = this.rutas;

        this.accountService.identity().then((account: Usuario) => {
            this.nameRol = account.rol.name;
            this.username = `${account.name} ${account.lastname}`;
            if (!this.isOpen) {
                notify(`Bienvenido ${account.lastLogin ? 'de nuevo' : ''} ${account.name} ${account.lastname}`, 'inverse');
                sessionStorage.setItem('isOpen', 'true');
            }
            this.cargaRutasDeUsuario();
        });
    }

    cargaRutasDeUsuario() {
        this.rutas.forEach(ruta => {
            ruta.authority.forEach(authority => {
                if (authority === this.nameRol)
                    this.rutasUsuario.push(ruta);
            });
        });
    }
}
