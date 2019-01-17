import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {ConsejoPopular, LineaDeProduccion, Parcela, Persona, Solicitud, TipoDeUso} from '../../../modelo';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Information, MensajeError} from '../../../mensaje/window.mensaje';
import {ConsejoPopularService} from '../../../servicios/consejo-popular.service';
import {TipoDeUsoService} from '../../../servicios/tipo-de-uso.service';
import {SolicitudService} from '../../../servicios/solicitud.service';
import {PersonaService} from '../../../servicios/persona.service';
import {ReplaySubject} from 'rxjs/index';
import {PersonaWindowsComponent} from '../../solicitante/persona-windows/persona-windows.component';
import {SelectionModel} from '@angular/cdk/collections';

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

    isLoadingResults = false;
    idSolicitud: number;
    formSolicitud: FormGroup;
    formParcela: FormGroup;
    formPersona: FormGroup;
    formLineaProduccion: FormGroup;
    parcelas: Parcela[] = [];
    lineasProduccion: LineaDeProduccion[] = [];
    insertar = false;
    solicitud: Solicitud;
    ultimoNumeroSolicitud: number;
    contadorParcela: number = 0;
    contadorLinea: number = 0;
    consejoPopular: ConsejoPopular;
    tipoDeUso: TipoDeUso;
    startDate = new Date(1988, 0, 1);
    personas: Persona[];
    displayedColumnsParcela: string[] = ['limiteN', 'limiteS', 'limiteE', 'limiteW', 'acciones'];
    displayedColumnsLinea: string[] = ['lineaDeProduccion', 'areaDedicada', 'acciones'];
    dataSourceParcela = new MatTableDataSource<Parcela>();
    dataSourceLinea = new MatTableDataSource<LineaDeProduccion>();
    public personasFiltradas: ReplaySubject<Persona[]> = new ReplaySubject<Persona[]>(1);

    constructor(public dialogRef: MatDialogRef<SolicitudWindowComponent>,
                @Inject(MAT_DIALOG_DATA){id, tipoDecreto = '300', tipoSolicitud = 'Nueva', fechaSolicitud = new Date(), numExpediente, persona, parcelas, lineasDeProduccion, areaSolicitada, estado = 'Por Tramitar'}: Solicitud,
                @Inject(MAT_DIALOG_DATA){tipoPersona = 'Natural', ci, nombre, primerApellido, segundoApellido, sexo = 'M', dirParticular, fechaNacimiento, movil, telFijo, situacionLaboral, asociado}: Persona,
                @Inject(MAT_DIALOG_DATA){consejoPopular, tipoDeUso, limiteS, limiteN, limiteE, limiteW}: Parcela,
                @Inject(MAT_DIALOG_DATA){lineaDeProduccion, areaDedicada, estudioSuelo}: LineaDeProduccion, private service: SolicitudService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoDeUsoService, private personaService: PersonaService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.consejoPopular = consejoPopular;
        this.tipoDeUso = tipoDeUso;
        this.idSolicitud = id;
        this.formSolicitud = new FormGroup({
            tipoDecreto: new FormControl(tipoDecreto),
            tipoSolicitud: new FormControl(tipoSolicitud, [Validators.required]),
            fechaSolicitud: new FormControl(fechaSolicitud),
            numExpediente: new FormControl(numExpediente, [Validators.required]),
            areaSolicitada: new FormControl(areaSolicitada, [Validators.required]),
            estado: new FormControl(estado, [Validators.required]),
        });

        this.formPersona = new FormGroup({
            tipoPersona: new FormControl(tipoPersona, [Validators.required]),
            ci: new FormControl(ci, [Validators.required, Validators.maxLength(11)]),
            nombre: new FormControl(nombre, [Validators.required]),
            primerApellido: new FormControl(primerApellido, [Validators.required]),
            segundoApellido: new FormControl(segundoApellido, [Validators.required]),
            sexo: new FormControl(sexo, [Validators.required]),
            dirParticular: new FormControl(dirParticular, [Validators.required]),
            fechaNacimiento: new FormControl(fechaNacimiento, [Validators.required]),
            movil: new FormControl(movil, [Validators.required, Validators.maxLength(8)]),
            telFijo: new FormControl(telFijo, [Validators.required, Validators.maxLength(8)]),
            situacionLaboral: new FormControl(situacionLaboral, [Validators.required]),
            asociado: new FormControl(asociado, [Validators.required])
        });

        this.formParcela = new FormGroup({
            contador: new FormControl(this.contadorParcela, []),
            limiteN: new FormControl('', [Validators.required]),
            limiteS: new FormControl('', [Validators.required]),
            limiteE: new FormControl('', [Validators.required]),
            limiteW: new FormControl('', [Validators.required])
        });
        this.formPersona.controls['tipoPersona'].valueChanges.subscribe(value => {
            console.log(value)
        });
        this.formLineaProduccion = new FormGroup({
            contador: new FormControl(this.contadorLinea, []),
            lineaDeProduccion: new FormControl('', [Validators.required]),
            areaDedicada: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        if (this.insertar) {
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

            this.listarTipoPersonaJuridica();

            this.service.obtenerUltimSolicitud().subscribe(resp => {
                if (resp.body.success) {
                    this.formSolicitud.get('numExpediente').setValue((resp.body.elemento.numExpediente) + 1);
                }
            });

        }
    }

    abrirVentana() {
        let dialogRef = this.dialog.open(PersonaWindowsComponent, {
            width: '400px', disableClose: true, data: new Persona('Juridica'),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                console.log(result);
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha insertardo la solicitud:' + result.elemento.nombre}
                });
                this.listarTipoPersonaJuridica();
                //this.paginator.page.emit();
            }
        });
    }

    get parcelasForm() {
        return this.formSolicitud.get('parcelas') as FormArray;
    }

    addParcela() {
        if (this.formParcela.valid) {
            this.parcelas.push(this.formParcela.value);
            this.dataSourceParcela = new MatTableDataSource<Parcela>(this.parcelas);
        }
    }

    deleteParcela(i) {
        this.parcelasForm.removeAt(i)
    }

    get lineasDeProduccionForm() {
        return this.formSolicitud.get('lineasDeProduccion') as FormArray;
    }

    addLineasProduccion() {
        if (this.formLineaProduccion.valid) {
            this.lineasProduccion.push(this.formLineaProduccion.value);
            this.dataSourceLinea = new MatTableDataSource<LineaDeProduccion>(this.lineasProduccion);
        }
    }

    deleteLineasDeProduccion(i) {
        this.lineasDeProduccionForm.removeAt(i)
    }

    listarTipoPersonaJuridica() {
        this.personaService.listarPorTipoPersona('Juridica').subscribe(resp => {
            if (resp.body.success) {
                this.personas = resp.body.elementos;
                this.personasFiltradas.next(this.personas);
            }
        });
    }

    insertarSolicitud(): void {
        if (this.formSolicitud.valid) {
            const solicitud = this.formSolicitud.value;
            solicitud.persona = {...this.formPersona.value};
            solicitud.parcelas = [...this.parcelas];
            solicitud.lineasDeProduccion = [...this.lineasProduccion];
            this.solicitud = solicitud;
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarSolicitud(this.solicitud).subscribe(resp => {
                    let appResp = resp.body;
                    console.log(resp);
                    if (appResp.success) {
                        this.dialogRef.close(resp.body);
                    } else {
                        this.dialog.open(MensajeError, {width: '400px', data: {mensaje: appResp.msg}});
                    }
                    this.isLoadingResults = false;
                });
            } else {
                this.service.modificarSolicitud(this.idSolicitud, this.solicitud).subscribe(resp => {
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

    compararPersonas(inicio: Persona, fin: Persona) {
        return inicio && fin && inicio.id === fin.id;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }
}
