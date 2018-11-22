import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProvinciaService} from "../../servicios/provincia.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../Servicios/account.service";
import {Principal} from "../../Servicios/principal.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    mensaje: string;
    isLoading: boolean = false;
    @ViewChild("password") passwordField: ElementRef;

    constructor(private accoutService: AccountService, private principal: Principal, private router: Router) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        document.body.setAttribute("class", "login-content sw-toggled");
    }

    iniciarSesion() {
        if (this.form.valid) {
            this.isLoading = true;
            this.accoutService.iniciarSesion(this.form.value).subscribe(response => {
                if (response.body.success) {
                    const usuario = response.body.elemento;
                    localStorage.setItem("user_token", response.headers.get("Authorization"));
                    localStorage.setItem("username", usuario.username);
                    this.principal.authenticate(usuario);
                    this.principal.hasAuthority("Administrador").then(has => {
                        console.log(has)
                        if (has) {
                            localStorage.setItem("isAdmin", "true");
                            this.router.navigate(["/admin/provincia"]);
                        } else {
                            localStorage.setItem("isAdmin", "false");
                            this.router.navigate(["/user/travel-list"]);
                        }
                    });
                } else {
                    this.isLoading = false;
                    this.mensaje = response.body.msg;
                    this.passwordField.nativeElement.focus();
                    // this.form.controls['password'].setValue("");
                }
            });
        }
    }
}
