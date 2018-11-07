import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Principal} from "../../Servicios/principal.service";
import {UsuarioService} from "../../Servicios/usuario.service";


@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
    form: FormGroup;

    constructor(private principal: Principal, private service: UsuarioService, private router: Router) {
        this.form = new FormGroup({
            username: new FormControl("", [Validators.required]),
            password: new FormControl("", [Validators.required]),
        });
    }

    ngOnInit() {
    }

    iniciarSesion(event: Event) {
        event.preventDefault();
        this.service.iniciarSesion(this.form.value).subscribe(response => {
            if (response.body.loggedIn) {
                localStorage.setItem("user_token", response.body.token);
                this.principal.authenticate(response.body.username);
                this.router.navigate([response.body.page]);
            }
        });
    }
}
