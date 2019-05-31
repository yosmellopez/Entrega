import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ConsejoPopular, Parcela, TipoUso} from '../../../modelo';
import { ConsejoPopularService } from '../../../servicios/consejo-popular.service';
import { TipoUsoService } from '../../../servicios/tipo-uso.service';
import {ReplaySubject} from "rxjs/index";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {ParcelaService} from "../../../servicios/parcela.service";

@Component({
    selector: 'app-parcela-window',
    templateUrl: './parcela-window.component.html',
    styleUrls: ['./parcela-window.component.css']
})
export class ParcelaWindow implements OnInit {
    isLoadingResults = false;
    idParcela:number
    formParcela: FormGroup;
    insertar = false;
    consejoPopulares: ConsejoPopular[] = [];
    tiposDeUso:TipoUso[] = [];

    public consejoPopularFiltrados: ReplaySubject<ConsejoPopular[]> = new ReplaySubject<ConsejoPopular[]>(1);
    public tiposDeUsoFiltrados: ReplaySubject<TipoUso[]> = new ReplaySubject<TipoUso[]>(1);

    constructor(public dialogRef: MatDialogRef<ParcelaWindow>, @Inject(MAT_DIALOG_DATA){id, consejoPopular, tipoUso, zonaCatastral, parcela, divicion, direccion, area, limiteN, limiteS, limiteE, limiteW, condicActual}: Parcela,private service:ParcelaService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoUsoService, private dialog:MatDialog) {
        this.insertar = id === null;
        this.idParcela = id;

        this.formParcela = new FormGroup({
            consejoPopular: new FormControl(consejoPopular, [Validators.required]),
            tipoUso: new FormControl(tipoUso, [Validators.required]),
            zonaCatastral: new FormControl(zonaCatastral, [Validators.required]),
            parcela: new FormControl(parcela, [Validators.required]),
            divicion: new FormControl(divicion, []),
            direccion: new FormControl(direccion, [Validators.required]),
            area: new FormControl(area, [Validators.required]),
            limiteN: new FormControl(limiteN, []),
            limiteS: new FormControl(limiteS, []),
            limiteE: new FormControl(limiteE, []),
            limiteW: new FormControl(limiteW, []),
            condicActual: new FormControl(condicActual, [])
        });
    }

    ngOnInit() {
        this.consejoPopularService.listarTodasConsejoPopular().subscribe(resp => {
            if (resp.body.success) {
                this.consejoPopulares = resp.body.elementos;
                this.consejoPopularFiltrados.next(this.consejoPopulares);
            }
        });

        this.tipodeUsoService.listarTipoUsoPorNombre('Ociosa').subscribe(resp => {
            if (resp.body.success) {
                this.tiposDeUso = resp.body.elementos;
                this.tiposDeUsoFiltrados.next(this.tiposDeUso);
            }
        });
    }

    insertarParcela(): void {
        if (this.formParcela.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarParcela(this.formParcela.value).subscribe(resp => {
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
                this.service.modificarParcela(this.idParcela, this.formParcela.value).subscribe(resp => {
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

    onNoClick(): void {
        this.dialogRef.close(false);
    }


    compararConsejoPopulares(inicio: ConsejoPopular, fin: ConsejoPopular) {
        return inicio && fin && inicio.id === fin.id;
    }

    compararTiposDeUso(inicio:TipoUso, fin: TipoUso) {
        return inicio && fin && inicio.id === fin.id;
    }

}
