import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../servicios/authentication.service";
import {Principal} from "../../Servicios/principal.service";
import {Rol, Usuario} from "../../modelo";
import {AccountService} from "../../guards/account.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    mensaje: string;
    isLoading: boolean = false;
    usuario:Usuario;
    rol:Rol;
    @ViewChild("password") passwordField: ElementRef;

    constructor(private accoutService: AccountService, private authenticationService :AuthenticationService , private router: Router) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        document.body.setAttribute("class", "login-content sw-toggled")
    }

    iniciarSesion() {
        if (this.form.valid) {
            this.isLoading = true;
            this.authenticationService.iniciarSesion(this.form.value).subscribe(response => {
                if (response.body.success) {
                    const usuario = response.body.elemento;
                    localStorage.setItem("user_token", response.headers.get("Authorization"));
                    localStorage.setItem("username", usuario.username);
                    this.accoutService.authenticate(usuario);
                    this.accoutService.hasAuthority("Administrador").then(has => {
                        console.log("entro has"+ has)
                        if (has) {
                            localStorage.setItem("isAdmin", "true");
                            this.router.navigate(["/admin/provincia"]);
                        } else {
                            localStorage.setItem("isAdmin", "false");
                            this.router.navigate(["/usuario/home"]);
                        }
                    });
                } else {
                    console.log('entro else')
                    this.isLoading = false;
                    this.mensaje = response.body.msg;
                    this.passwordField.nativeElement.focus();
                }
            });
        }
    }
}
