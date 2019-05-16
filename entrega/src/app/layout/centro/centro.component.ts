import { Component, OnInit } from '@angular/core';
import { Rol, RouteInfo } from '../../modelo';
import { APP_RUTAS } from '../../app-routing';
import { AccountService } from '../../guards/account.service';
import { RouterLink } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-centro',
    templateUrl: './centro.component.html',
    styleUrls: ['./centro.component.css']
})
export class CentroComponent implements OnInit {
    rutas: RouteInfo[] = APP_RUTAS;
    rutasUsuario: RouteInfo[] = []
    nameRol: string;

    constructor(private accountService: AccountService) {
    }

    ngOnInit() {
        document.body.setAttribute('class', 'sw-toggled');
        //this.rutasUsuario = this.rutas;

        this.accountService.identity().then(account => {
            this.nameRol = account.rol.name
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
