import {Component, OnInit} from '@angular/core';
import {ProvinciaService} from "../../Servicios/provincia.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    mensaje: string = "FDSDFSDF";

    constructor(private servicio: ProvinciaService, private router: Router) {
    }

    ngOnInit() {
    }

    login() {
        this.servicio.iniciarSesion({username: "yosmel", password: "123"}).subscribe(resp => {
            if (resp.body.success) {
                localStorage.setItem("user_token", resp.headers.get("Authorization"));
                this.router.navigate(["/admin/provincia"]);
            } else {
                this.mensaje = resp.body.msg;
            }
        });
    }
}
