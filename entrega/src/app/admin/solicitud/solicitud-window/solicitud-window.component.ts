import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConsejoPopular, LineaDeProduccion, Parcela, Persona, Solicitud, TipoDeUso} from "../../../modelo";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {ConsejoPopularService} from "../../../servicios/consejo-popular.service";
import {TipoDeUsoService} from "../../../servicios/tipo-de-uso.service";
import {SolicitudService} from "../../../servicios/solicitud.service";

export const MY_FORMATS = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'LL',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-solicitud-window',
    templateUrl: './solicitud-window.component.html',
    styleUrls: ['./solicitud-window.component.css'],
    providers: [{provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class SolicitudWindowComponent implements OnInit {

    isLinear = false;
    isLoadingResults = false;
    idSolicitud: number;
    formSolici: FormGroup;
    //persona:FormGroup;
    parcelas: FormGroup;
    lineasDeProduccion: FormGroup;
    insertar = false;
    solicitud: Solicitud;
    consejoPopular: ConsejoPopular;
    tipoDeUso: TipoDeUso;
    startDate = new Date(1988, 0, 1);
    selected = 'Natural';


    constructor(public dialogRef: MatDialogRef<SolicitudWindowComponent>,
                @Inject(MAT_DIALOG_DATA){id, tipoDecreto = '300', tipoSolicitud = 'Nueva', fechaSolicitud = new Date(), numExpediente, persona, parcelas, lineasDeProduccion, areaSolicitada, estado = 'Por Tramitar'}: Solicitud,
                @Inject(MAT_DIALOG_DATA){tipoPersona = 'Natural', ci, nombre, primerApellido, segundoApellido, sexo = 'M', dirParticular, fechaNacimiento, movil, telFijo, situacionLaboral, asociado}: Persona,
                @Inject(MAT_DIALOG_DATA){consejoPopular, tipoDeUso, limiteS, limiteN, limiteE, limiteW}: Parcela,
                @Inject(MAT_DIALOG_DATA){lineaDeProduccion, areaDedicada, estudioSuelo}: LineaDeProduccion, private formBuilder: FormBuilder, private service: SolicitudService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoDeUsoService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.consejoPopular = consejoPopular;
        this.tipoDeUso = tipoDeUso;
        this.idSolicitud = id;
        this.formSolici = formBuilder.group({
            tipoDecreto: new FormControl(tipoDecreto),
            tipoSolicitud: new FormControl(tipoSolicitud, [Validators.required]),
            fechaSolicitud: new FormControl(fechaSolicitud),
            numExpediente: new FormControl(numExpediente, [Validators.required]),
            areaSolicitada: new FormControl(areaSolicitada, [Validators.required]),
            persona: formBuilder.group({
                tipoPersona: new FormControl(tipoPersona, [Validators.required]),
                ci: new FormControl(ci, [Validators.required, Validators.maxLength(11)]),
                nombre: new FormControl(nombre, [Validators.required]),
                primerApellido: new FormControl(primerApellido, [Validators.required]),
                segundoApellido: new FormControl(segundoApellido, [Validators.required]),
                sexo: new FormControl(sexo, [Validators.required]),
                dirParticular: new FormControl(dirParticular, [Validators.required]),
                fechaDeNacimiento: new FormControl(fechaNacimiento, [Validators.required]),
                movil: new FormControl(movil, [Validators.required, Validators.maxLength(8)]),
                telFijo: new FormControl(telFijo, [Validators.required, Validators.maxLength(8)]),
                situacionLaboral: new FormControl(situacionLaboral, [Validators.required]),
                //asociado: new FormControl(asociado, [Validators.required])
            }),
            parcelas: this.formBuilder.array([]),
            lineasDeProduccion: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.consejoPopularService.listarConsejoPopularNoDefinido('No Definido').subscribe(resp => {
            if (resp.body.success) {
                this.consejoPopular = resp.body.elemento;
            }
        });

        this.tipodeUsoService.listarTipoDeUsoNoDefinido('No Definido').subscribe(resp => {
            if (resp.body.success) {
                this.tipoDeUso = resp.body.elemento;
            }
        });
    }

    get parcelasForm() {
        return this.formSolici.get('parcelas') as FormArray;
    }

    addParcela() {
        const parcela = this.formBuilder.group({
            consejoPopular: [this.consejoPopular],
            tipoDeUso: [this.tipoDeUso],
            limiteN: [],
            limiteS: [],
            limiteE: [],
            limiteW: [],
        })
        this.parcelasForm.push(parcela);
    }

    deleteParcela(i) {
        this.parcelasForm.removeAt(i)
    }

    get lineasDeProduccionForm() {
        return this.formSolici.get('lineasDeProduccion') as FormArray;
    }

    addLineasDeProduccion() {
        const lineaDeProduccion = this.formBuilder.group({
            lineaDeProduccion: [],
            areaDedicada: [],
        })

        this.lineasDeProduccionForm.push(lineaDeProduccion);
    }

    deleteLineasDeProduccion(i) {
        this.lineasDeProduccionForm.removeAt(i)
    }

    selectTipoPersona(tipoPersona: string): void {
        console.log('Entro');
        if (tipoPersona == 'Juridica') {
            console.log('Entro');
            this.formSolici.get('persona').get('sexo').setValue(null);
            this.formSolici.get('persona').get('dirParticular').setValue(null);
            this.formSolici.get('persona').get('fechaDeNacimiento').setValue(null);
            this.formSolici.get('persona').get('movil').setValue(null);
            this.formSolici.get('persona').get('telFijo').setValue(null);
            this.formSolici.get('persona').get('situacionLaboral').setValue(null);
        } else {
            this.formSolici.get('persona').get('sexo').setValue('M');
            this.formSolici.get('persona').get('dirParticular').setValue(null);
            this.formSolici.get('persona').get('telFijo').setValue(null);
        }
    }

    insertarSolicitud(): void {
        console.log(this.formSolici.value)
        console.log(this.formSolici.valid)
        if (this.formSolici.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarSolicitud(this.formSolici.value).subscribe(resp => {
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
                this.service.modificarSolicitud(this.idSolicitud, this.formSolici.value).subscribe(resp => {
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
}
