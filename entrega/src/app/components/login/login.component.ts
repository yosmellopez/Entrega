import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../../Servicios/account.service";
import {Principal} from "../../Servicios/principal.service";
import {UsuarioService} from "../../servicios/usuario.service";
import {Rol, Usuario} from "../../modelo";

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

    constructor(private accoutService: AccountService, private principal: Principal, private router: Router, private userService:UsuarioService) {
        this.form = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        document.body.setAttribute("class", "login-content sw-toggled")


    }

    registrarUsuario(){
        this.userService.obtenerRol(1).subscribe(response=>{
            if (response.body.success){
                this.rol = response.body.elemento;
                console.log(this.rol);
            }else {
                console.log(response.body.msg);
            }
        });

        this.accoutService.get().subscribe(response=>{
            if (response){
                this.usuario = new Usuario({
                    name:'Admin',
                    lastname:'Admin',
                    username:'Admin',
                    password:'123',
                    rol:this.rol
                });

                console.log(this.usuario);

                this.userService.registrarUsuario(this.usuario).subscribe(response=>{
                    if (response){
                        console.log(response);
                    }
                });


            }else{
                console.log(response.body.msg);
            }

        });


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
                        console.log("entro has"+has)
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
                    // this.form.controls['password'].setValue("");
                }
            });
        }
    }
}
