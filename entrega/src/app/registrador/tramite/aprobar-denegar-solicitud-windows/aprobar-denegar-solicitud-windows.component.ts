import {Component, Inject, OnInit} from '@angular/core';
import {Solicitud} from "../../../modelo";
import {TramiteService} from "../../../servicios/tramite.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-aprobar-denegar-solicitud-windows',
    templateUrl: './aprobar-denegar-solicitud-windows.component.html',
    styleUrls: ['./aprobar-denegar-solicitud-windows.component.css']
})
export class AprobarDenegarSolicitudWindowsComponent implements OnInit {
    checked = false;
    formSolicitud: FormGroup;
    cAoPCC: boolean = false;

    constructor(public dialogRef: MatDialogRef<AprobarDenegarSolicitudWindowsComponent>, @Inject(MAT_DIALOG_DATA) {
        id,
        municipio,
        tipoDecreto,
        tipoSolicitud,
        fechaSolicitud,
        numExpediente,
        persona,
        parcelas,
        lineasDeProduccion,
        areaSolicitada,
        tramite,
        estado,
        aprobadoCAgraria,
        aprobadoPCC,
        detallesMT,
        detallesAproDesa
    }: Solicitud, private service: TramiteService, private dialog: MatDialog) {
        this.cAoPCC = aprobadoCAgraria === '';
        this.formSolicitud = new FormGroup({
            id: new FormControl(id, []),
            municipio: new FormControl(municipio, []),
            tipoDecreto: new FormControl(tipoDecreto, []),
            tipoSolicitud: new FormControl(tipoSolicitud, []),
            fechaSolicitud: new FormControl(fechaSolicitud, []),
            numExpediente: new FormControl(numExpediente, []),
            persona: new FormControl(persona, []),
            parcelas: new FormControl(parcelas, []),
            lineasDeProduccion: new FormControl(lineasDeProduccion, []),
            areaSolicitada: new FormControl(areaSolicitada, []),
            tramite: new FormControl(tramite, []),
            estado: new FormControl(estado),
            aprobadoCAgraria: new FormControl(aprobadoCAgraria, []),
            aprobadoPCC: new FormControl(aprobadoPCC, []),
            detallesMT: new FormControl(detallesMT, []),
            detallesAproDesa: new FormControl(detallesAproDesa, [Validators.required]),
        });
    }

    ngOnInit() {
        if (this.cAoPCC) {
            if (this.formSolicitud.get('aprobadoCAgraria').value == '') {
                this.formSolicitud.get('aprobadoCAgraria').setValue('Denegada');
            }
        } else {
            if (this.formSolicitud.get('aprobadoPCC').value == '') {
                this.formSolicitud.get('aprobadoPCC').setValue('Denegada');
            }
        }
    }

    aprobDenegarSolic() {
        if (this.formSolicitud.valid) {
            if (this.cAoPCC) {
                this.service.aprobarDenegarSolicCA(this.formSolicitud.get('id').value, this.formSolicitud.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: '400px', data: {mensaje: appResp.msg}});
                    }
                });
            } else {
                this.service.aprobarDenegarSolicPCC(this.formSolicitud.get('id').value, this.formSolicitud.value).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: '400px', data: {mensaje: appResp.msg}});
                    }
                });
            }
        }
    }

    onChange(event) {
        if (this.cAoPCC) {
            if (event.checked) {
                this.checked = true;
                this.formSolicitud.get('aprobadoCAgraria').setValue('Aprobada');
            } else {
                this.checked = false;
                this.formSolicitud.get('aprobadoCAgraria').setValue('Denegada');
            }
        } else {
            if (event.checked) {
                this.checked = true;
                this.formSolicitud.get('aprobadoPCC').setValue('Aprobada');
            } else {
                this.checked = false;
                this.formSolicitud.get('aprobadoPCC').setValue('Denegada');
            }
        }

        console.log(this.formSolicitud.value);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
