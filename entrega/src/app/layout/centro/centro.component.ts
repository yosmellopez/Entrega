import {Component, OnInit} from '@angular/core';
import {RouteInfo} from "../../modelo";
import {APP_RUTAS} from "../../app-routing";

@Component({
    selector: 'app-centro',
    templateUrl: './centro.component.html',
    styleUrls: ['./centro.component.css']
})
export class CentroComponent implements OnInit {
    rutas: RouteInfo[] = APP_RUTAS;
    rutasUsuario: RouteInfo[] = [];

    constructor() {
    }

    ngOnInit() {
        document.body.setAttribute("class", "sw-toggled");
        this.rutasUsuario = this.rutas;
    }

}
