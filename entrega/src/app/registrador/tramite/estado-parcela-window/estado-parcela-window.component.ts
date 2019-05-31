import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {SolicitudWindowComponent} from "../../../admin/solicitud/solicitud-window/solicitud-window.component";
import {PersonaParcelas, Solicitud} from "../../../modelo";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {TramiteService} from "../../../servicios/tramite.service";

@Component({
  selector: 'app-estado-parcela-window',
  templateUrl: './estado-parcela-window.component.html',
  styleUrls: ['./estado-parcela-window.component.css']
})
export class EstadoParcelaWindowComponent implements OnInit {

    formEstadoParc: FormGroup;
    isLoadingResults = false;

    constructor(public dialogRef: MatDialogRef<EstadoParcelaWindowComponent>, @Inject(MAT_DIALOG_DATA){parcela, personaParcelaPK, fechaAlta, tipoDeTenencia, fechaBaja, detallesBaja, gradoDeExplotacion, noCertTenInscrito, cultOActivAgroDediAct, areaVacia, existirCausas}: PersonaParcelas, private service: TramiteService, private dialog:MatDialog) {

        console.log(personaParcelaPK);
        this.formEstadoParc = new FormGroup({
            parcela: new FormControl(parcela, []),
            personaParcelaPK: new FormControl(personaParcelaPK, []),
            tipoDeTenencia: new FormControl(tipoDeTenencia, [Validators.required]),
            gradoDeExplotacion: new FormControl(gradoDeExplotacion, [Validators.required]),
            noCertTenInscrito: new FormControl(noCertTenInscrito, [Validators.required]),
            cultOActivAgroDediAct: new FormControl(cultOActivAgroDediAct, [Validators.required]),
            areaVacia: new FormControl(areaVacia, []),
            existirCausas: new FormControl(existirCausas, [])
        })
    }

    ngOnInit() {

    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    modificarEstadoParc(): void {
        if (this.formEstadoParc.valid) {
            this.service.modificarEstadoParc(this.formEstadoParc.value).subscribe(resp => {
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
