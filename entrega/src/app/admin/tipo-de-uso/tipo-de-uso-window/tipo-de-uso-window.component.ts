import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TipoDeSuperficieService} from "../../../servicios/tipo-de-superficie.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {TipoDeSuperficie, TipoDeUso} from "../../../modelo";
import {TipoDeUsoService} from "../../../servicios/tipo-de-uso.service";
import {ReplaySubject} from "rxjs/index";
import {MensajeError} from "../../../mensaje/window.mensaje";

@Component({
  selector: 'app-tipo-de-uso-window',
  templateUrl: './tipo-de-uso-window.component.html',
  styleUrls: ['./tipo-de-uso-window.component.css']
})
export class TipoDeUsoWindowComponent implements OnInit {

    isLoadingResults = false;
    idtipoDeUso: number;
    form: FormGroup;
    insertar = false;
    tipoDeSuperficies: TipoDeSuperficie[]=[];
    tipoDeUso: TipoDeUso;
    public tipoDeSuperficieFiltradas: ReplaySubject<TipoDeSuperficie[]> = new ReplaySubject<TipoDeSuperficie[]>(1);


    constructor(public dialogRef: MatDialogRef<TipoDeUsoWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, codigo, nombre, tipoDeSuperficie}: TipoDeUso,
                private service: TipoDeUsoService, private dialog: MatDialog, private tipoDeSuperficieService:TipoDeSuperficieService) {
        this.insertar = id == null;
        this.idtipoDeUso = id;
        this.form = new FormGroup({
            codigo: new FormControl(codigo, [Validators.required, Validators.maxLength(2)]),
            nombre: new FormControl(nombre, [Validators.required]),
            tipoDeSuperficie: new FormControl(tipoDeSuperficie, [Validators.required]),
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }


    ngOnInit() {
        this.tipoDeSuperficieService.listarTodasTipoDeSuperficie().subscribe(resp=> {
            if (resp.body.success){
                this.tipoDeSuperficies = resp.body.elementos;
                this.tipoDeSuperficieFiltradas.next(this.tipoDeSuperficies);
            }
        });

    }

    insertarTipoDeUso(): void {
        console.log(this.form.value);
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarTipoDeUso(this.form.value).subscribe(resp => {
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
                this.service.modificarTipoDeUso(this.idtipoDeUso, this.form.value).subscribe(resp => {
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

    compararTipoDeSuperficies(inicio: TipoDeSuperficie, fin: TipoDeSuperficie) {
        return inicio && fin && inicio.id === fin.id;
    }

}
