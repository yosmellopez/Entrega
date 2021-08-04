import {Component, Inject, OnInit} from '@angular/core';
import {LineaDeProduccion} from '../../../modelo';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MensajeError} from '../../../mensaje/window.mensaje';
import {TramiteService} from '../../../servicios/tramite.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-aprobar-denegar-lpwindow',
    templateUrl: './aprobar-denegar-lpwindow.component.html',
    styleUrls: ['./aprobar-denegar-lpwindow.component.css']
})
export class AprobarDenegarLPWindowComponent implements OnInit {
    idLineaP: number;
    numExpediente: number;
    checked = false;
    formAprobDenegLP: FormGroup;
    color = 'primary'
    lineaDeProduc: LineaDeProduccion;
    isLoadingResults = false;

    constructor(public dialogRef: MatDialogRef<AprobarDenegarLPWindowComponent>, @Inject(MAT_DIALOG_DATA) lineaDeProduccion: LineaDeProduccion, @Inject(MAT_DIALOG_DATA) {numExp}, private service: TramiteService, private dialog: MatDialog) {
        this.numExpediente = numExp;
        this.lineaDeProduc = lineaDeProduccion;
        this.idLineaP = this.lineaDeProduc.id;
        this.checked = this.lineaDeProduc.aprobado;
        this.formAprobDenegLP = new FormGroup({
            lineaDeProduccion: new FormControl(this.lineaDeProduc.lineaDeProduccion, []),
            areaDedicada: new FormControl(this.lineaDeProduc.areaDedicada, []),
            aprobado: new FormControl(this.lineaDeProduc.aprobado, []),
            estudioSuelo: new FormControl(this.lineaDeProduc.estudioSuelo, [Validators.required])
        });
    }

    ngOnInit() {

    }

    onChange(event) {
        if (event.checked) {
            this.checked = true;
            this.formAprobDenegLP.get('aprobado').setValue(true);
        } else {
            this.checked = false;
            this.formAprobDenegLP.get('aprobado').setValue(false);
        }
        console.log(this.formAprobDenegLP.value);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    aproDenLineaDeProduccion(): void {
        if (this.formAprobDenegLP.valid) {
            this.service.aprobarDenegarLineaPro(this.idLineaP, this.formAprobDenegLP.value, this.numExpediente).subscribe(resp => {
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
