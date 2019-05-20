import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { ConsejoPopular, Parcela, Solicitud } from '../../../modelo';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { ConsejoPopularService } from '../../../servicios/consejo-popular.service';
import { TipoUsoService } from '../../../servicios/tipo-uso.service';

@Component({
    selector: 'app-parcela-window',
    templateUrl: './parcela-window.component.html',
    styleUrls: ['./parcela-window.component.css']
})
export class ParcelaWindow implements OnInit {
    formParcela: FormGroup;
    insertar = false;
    consejoPopulares: ConsejoPopular[] = [];

    constructor(public dialogRef: MatDialogRef<ParcelaWindow>, @Inject(MAT_DIALOG_DATA){id, persona, consejoPopular, tipoUso, zonaCatastral, parcela, divicion, direccion, area, limiteN, limiteS, limiteE, limiteW, condicActual}: Parcela,
                private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoUsoService) {
        this.insertar = id === null;
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
        this.consejoPopularService.listarConsejoPopularNoDefinido('No Definido').subscribe(resp => {
            if (resp.body.success) {
                this.consejoPopulares = resp.body.elementos;
                this.formParcela.get('consejoPopular').setValue(resp.body.elemento);
            }
        });
        this.tipodeUsoService.listarTipoUsoNoDefinido('No Definido').subscribe(resp => {
            if (resp.body.success) {
                this.formParcela.get('tipoUso').setValue(resp.body.elemento);
            }
        });
    }

    addParcela() {
        if (this.formParcela.valid) {
            const parcela = this.formParcela.value as Parcela;
            this.dialogRef.close(parcela);
        }
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

}
