import {Component, Inject, OnInit} from '@angular/core';
import {BienhechuriaWindowComponent} from "../../bienhechurias/bienhechuria-window/bienhechuria-window.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BienhechuriaService} from "../../../servicios/bienhechuria.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Bienhechuria, Regulacion} from "../../../modelo";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {RegulacionService} from "../../../servicios/regulacion.service";

@Component({
  selector: 'app-regulacion-window',
  templateUrl: './regulacion-window.component.html',
  styleUrls: ['./regulacion-window.component.css']
})
export class RegulacionWindowComponent implements OnInit {
    isLoadingResults = false;
    idRegulacion: number;
    form: FormGroup;
    insertar = false;
    bienhechuria:Bienhechuria;


    constructor(public dialogRef: MatDialogRef<BienhechuriaWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, regulacion}: Regulacion,
                private service: RegulacionService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.idRegulacion = id;
        this.form = new FormGroup({
            regulacion: new FormControl(regulacion, [Validators.required])
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    ngOnInit() {

    }

    insertarRegulacion(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarRegulacion(this.form.value).subscribe(resp => {
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
                this.service.modificarRegulacion(this.idRegulacion, this.form.value).subscribe(resp => {
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
