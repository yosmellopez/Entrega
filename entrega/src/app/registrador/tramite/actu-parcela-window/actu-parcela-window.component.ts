import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsejoPopularService } from '../../../servicios/consejo-popular.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ReplaySubject } from 'rxjs/index';
import { ConsejoPopular, Parcela, TipoUso } from '../../../modelo';
import { TipoUsoService } from '../../../servicios/tipo-uso.service';
import { MensajeError } from '../../../mensaje/window.mensaje';
import { TramiteService } from '../../../servicios/tramite.service';

@Component({
    selector: 'app-actu-parcela-window',
    templateUrl: './actu-parcela-window.component.html',
    styleUrls: ['./actu-parcela-window.component.css']
})
export class ActuParcelaWindowComponent implements OnInit {
    isLoadingResults = false;
    parcela: Parcela;
    idParcela: number
    numExp: number;
    formParcela: FormGroup;
    insertar = false;
    consejoPopulares: ConsejoPopular[] = [];
    tiposDeUso: TipoUso[] = [];

    public consejoPopularFiltrados: ReplaySubject<ConsejoPopular[]> = new ReplaySubject<ConsejoPopular[]>(1);
    public tiposDeUsoFiltrados: ReplaySubject<TipoUso[]> = new ReplaySubject<TipoUso[]>(1);

    constructor(public dialogRef: MatDialogRef<ActuParcelaWindowComponent>, @Inject(MAT_DIALOG_DATA) parcela: Parcela, @Inject(MAT_DIALOG_DATA){numExp}, private service: TramiteService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoUsoService, private dialog: MatDialog) {
        this.parcela = parcela;
        this.insertar = this.parcela.id === null;
        this.idParcela = this.parcela.id;
        this.numExp = numExp;


        this.formParcela = new FormGroup({
            consejoPopular: new FormControl(this.parcela.consejoPopular, [Validators.required]),
            tipoUso: new FormControl(this.parcela.tipoUso, [Validators.required]),
            zonaCatastral: new FormControl(this.parcela.zonaCatastral, [Validators.required]),
            parcela: new FormControl(this.parcela.parcela, [Validators.required]),
            divicion: new FormControl(this.parcela.divicion, []),
            direccion: new FormControl(this.parcela.direccion, [Validators.required]),
            area: new FormControl(this.parcela.area, [Validators.required]),
            limiteN: new FormControl(this.parcela.limiteN, []),
            limiteS: new FormControl(this.parcela.limiteS, []),
            limiteE: new FormControl(this.parcela.limiteE, []),
            limiteW: new FormControl(this.parcela.limiteW, []),
            condicActual: new FormControl(this.parcela.condicActual, [])
        });
    }

    ngOnInit() {
        this.consejoPopularService.listarTodasConsejoPopular().subscribe(resp => {
            if (resp.body.success) {
                this.consejoPopulares = resp.body.elementos;
                this.consejoPopularFiltrados.next(this.consejoPopulares);
            }
        });

        this.tipodeUsoService.listarTodasTipoUso().subscribe(resp => {
            if (resp.body.success) {
                this.tiposDeUso = resp.body.elementos;
                this.tiposDeUsoFiltrados.next(this.tiposDeUso);
            }
        });
    }

    insertarParcela(): void {
        if (this.formParcela.valid) {
            this.isLoadingResults = true;
            this.service.modifParcela(this.idParcela, this.formParcela.value, this.numExp).subscribe(resp => {
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


    onNoClick(): void {
        this.dialogRef.close(false);
    }


    compararConsejoPopulares(inicio: ConsejoPopular, fin: ConsejoPopular) {
        return inicio && fin && inicio.id === fin.id;
    }

    compararTiposDeUso(inicio: TipoUso, fin: TipoUso) {
        return inicio && fin && inicio.id === fin.id;
    }

}
