import { Component, Inject, OnInit } from '@angular/core';
import { TipoSuperficie } from '../../../modelo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { MensajeError } from '../../../mensaje/window.mensaje';
import { TipoSuperficieService } from '../../../servicios/tipo-superficie.service';


@Component({
    selector: 'app-tipo-de-superficie-window',
    templateUrl: './tipo-superficie-window.component.html',
    styleUrls: ['./tipo-superficie-window.component.css']
})
export class TipoSuperficieWindowComponent implements OnInit {

    isLoadingResults = false;
    idtipoDeSuperficie: number;
    form: FormGroup;
    insertar = false;
    tipoDeSuperficie: TipoSuperficie;


    constructor(public dialogRef: MatDialogRef<TipoSuperficieWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, codigo, nombre}: TipoSuperficie,
                private service: TipoSuperficieService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.idtipoDeSuperficie = id;
        console.log(this.insertar);
        this.form = new FormGroup({
            codigo: new FormControl(codigo, [Validators.required, Validators.maxLength(2)]),
            nombre: new FormControl(nombre, [Validators.required]),
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }


    ngOnInit() {

    }

    insertarTipoDeSuperficie(): void {
        console.log(this.form.value);
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarTipoSuperficie(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    console.log(resp);
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: '400px', data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarTipoSuperficie(this.idtipoDeSuperficie, this.form.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: '400px', data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            }
        }
    }

}
