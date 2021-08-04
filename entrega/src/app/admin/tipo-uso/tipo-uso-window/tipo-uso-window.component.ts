import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TipoSuperficieService} from "../../../servicios/tipo-superficie.service";
import {TipoSuperficie, TipoUso} from "../../../modelo";
import {TipoUsoService} from "../../../servicios/tipo-uso.service";
import {ReplaySubject} from "rxjs";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-tipo-de-uso-window',
    templateUrl: './tipo-uso-window.component.html',
    styleUrls: ['./tipo-uso-window.component.css']
})
export class TipoUsoWindowComponent implements OnInit {

    isLoadingResults = false;
    idTipoUso: number;
    form: FormGroup;
    insertar = false;
    tipoSuperficies: TipoSuperficie[] = [];
    tipoUso: TipoUso;
    public tipoSuperficieFiltradas: ReplaySubject<TipoSuperficie[]> = new ReplaySubject<TipoSuperficie[]>(1);


    constructor(public dialogRef: MatDialogRef<TipoUsoWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, codigo, nombre, tipoSuperficie}: TipoUso,
                private service: TipoUsoService, private dialog: MatDialog, private tipoSuperficieService: TipoSuperficieService) {
        this.insertar = id == null;
        this.idTipoUso = id;
        this.form = new FormGroup({
            codigo: new FormControl(codigo, [Validators.required, Validators.maxLength(2)]),
            nombre: new FormControl(nombre, [Validators.required]),
            tipoSuperficie: new FormControl(tipoSuperficie, [Validators.required]),
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }


    ngOnInit() {
        this.tipoSuperficieService.listarTodasTipoSuperficie().subscribe(resp => {
            if (resp.body.success) {
                this.tipoSuperficies = resp.body.elementos;
                this.tipoSuperficieFiltradas.next(this.tipoSuperficies);
            }
        });

    }

    insertarTipoUso(): void {
        console.log(this.form.value);
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarTipoUso(this.form.value).subscribe(resp => {
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
                this.service.modificarTipoUso(this.idTipoUso, this.form.value).subscribe(resp => {
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

    compararTipoSuperficies(inicio: TipoSuperficie, fin: TipoSuperficie) {
        return inicio && fin && inicio.id === fin.id;
    }

}
