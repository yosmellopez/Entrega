import {Component, Inject, OnInit} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    NgForm,
    Validators
} from "@angular/forms";
import {ErrorStateMatcher, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ReplaySubject} from "rxjs/index";
import {Rol, Usuario} from "../../../modelo";
import {UsuarioService} from "../../../servicios/usuario.service";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {getToken} from "@angular/router/src/utils/preactivation";
import {AccountService} from "../../../guards/account.service";


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}


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
    //igual:boolean;
    hide = true;
    public rolesFiltrados: ReplaySubject<Rol[]> = new ReplaySubject<Rol[]>(1);

    matcher = new MyErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<UsuarioWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, email, name, lastname, username, rol}: Usuario,
              private service: UsuarioService, private dialog: MatDialog, private formBuilder: FormBuilder) {
      this.insertar = id == null;
      this.idUsuario = id;
      if (this.insertar){
          this.form = this.formBuilder.group({
              email: new FormControl(email,[Validators.required, Validators.email,]),
              name: new FormControl(name,[Validators.required]),
              lastname: new FormControl(lastname,[Validators.required]),
              username: new FormControl(username,[Validators.required]),
              password: new FormControl('',[Validators.required]),
              confirmPassword: new FormControl('',[Validators.required]),
              rol:new FormControl(rol,[Validators.required])
          },{validators:this.checkPasswords});
      } else {
          this.form = this.formBuilder.group({
              email: new FormControl(email,[Validators.required, Validators.email,]),
              name: new FormControl(name,[Validators.required]),
              lastname: new FormControl(lastname,[Validators.required]),
              username: new FormControl(username,[Validators.required]),
              rol:new FormControl(rol,[Validators.required])
          });
      }

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
        }else {
            console.log(this.form);
        }
    }

    compararRol(inicio: Rol, fin: Rol) {
        return inicio && fin && inicio.id === fin.id;
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true }
    }


    //matcherPassword = new PasswordErrorStateMatcher();

}
