import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Bienhechuria} from "../../../modelo";
import {BienhechuriaService} from "../../../servicios/bienhechuria.service";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-bienhechuria-window',
    templateUrl: './bienhechuria-window.component.html',
    styleUrls: ['./bienhechuria-window.component.css']
})
export class BienhechuriaWindowComponent implements OnInit {

    isLoadingResults = false;
    idBienhechuria: number;
    form: FormGroup;
    insertar = false;
    bienhechuria: Bienhechuria;


    constructor(public dialogRef: MatDialogRef<BienhechuriaWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, nombre}: Bienhechuria,
                private service: BienhechuriaService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.idBienhechuria = id;
        this.form = new FormGroup({
            nombre: new FormControl(nombre, [Validators.required])
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    ngOnInit() {

    }

    insertarBienhechuria(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarBienhechuria(this.form.value).subscribe(resp => {
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
                this.service.modificarBienhechuria(this.idBienhechuria, this.form.value).subscribe(resp => {
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
}
