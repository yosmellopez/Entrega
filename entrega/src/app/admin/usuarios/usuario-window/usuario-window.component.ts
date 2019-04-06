import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ReplaySubject} from "rxjs/index";
import {Rol, Usuario} from "../../../modelo";
import {UsuarioService} from "../../../servicios/usuario.service";
import {MensajeError} from "../../../mensaje/window.mensaje";

@Component({
  selector: 'app-usuario-window',
  templateUrl: './usuario-window.component.html',
  styleUrls: ['./usuario-window.component.css']
})

export class UsuarioWindowComponent implements OnInit {

    isLoadingResults = false;
    idUsuario: number;
    form: FormGroup;
    insertar = false;
    usuario: Usuario;
    roles: Rol[] = [];
    igual:boolean;
    public rolesFiltrados: ReplaySubject<Rol[]> = new ReplaySubject<Rol[]>(1);

  constructor(public dialogRef: MatDialogRef<UsuarioWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, email, name, lastname, username, rol}: Usuario,
              private service: UsuarioService, private dialog: MatDialog) {
      this.insertar = id == null;
      this.idUsuario = id;
      this.form = new FormGroup({
          email: new FormControl(email,[Validators.required, Validators.email,]),
          name: new FormControl(name,[Validators.required]),
          lastname: new FormControl(lastname,[Validators.required]),
          username: new FormControl(username,[Validators.required]),
          password: new FormControl('',[Validators.required]),
          confirmPassword: new FormControl('',[Validators.required]),
          rol:new FormControl(rol,[Validators.required])
      });


  }

    onNoClick(): void {
        this.dialogRef.close(false);
    }


    ngOnInit() {
        this.service.listarRoles().subscribe(resp => {
            if (resp.body.success) {
                this.roles = resp.body.elementos;
                this.rolesFiltrados.next(this.roles);
            }
        });
    }

    insertarUsuario(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarUsuario(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    console.log(resp);
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarUsuario(this.idUsuario, this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: "400px", data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            }
        }
    }

    compararRol(inicio: Rol, fin: Rol) {
        return inicio && fin && inicio.id === fin.id;
    }

    passwordMatchValidator():boolean{
        console.log(this.form.get('password').value);
        console.log(this.form.get('confirmPassword').value);

      if (this.form.get('password').value == this.form.get('confirmPassword').value) {
          return true;
      }else{
          return false;
      }


    }


    //matcherPassword = new PasswordErrorStateMatcher();

}
