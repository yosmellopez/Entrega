import { Component, Inject, OnInit } from '@angular/core';

import {
    MAT_DATE_FORMATS,
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
    MatStepper,
    MatTableDataSource
} from '@angular/material';
import {
    ConsejoPopular, Integracion,
    LineaDeProduccion,
    Municipio,
    Parcela,
    Persona, PersonaAyuda,
    Solicitud,
    TipoUso
} from '../../../modelo';
import {
    FormArray,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { Information, MensajeError } from '../../../mensaje/window.mensaje';
import { ConsejoPopularService } from '../../../servicios/consejo-popular.service';
import { TipoUsoService } from '../../../servicios/tipo-uso.service';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { PersonaService } from '../../../servicios/persona.service';
import { Observable, ReplaySubject } from 'rxjs/index';
import { PersonaWindowsComponent } from '../../solicitante/persona-windows/persona-windows.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MunicipioService } from '../../../servicios/municipio.service';

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
    formPersonaAyuda: FormGroup;
    formLineaProduccion: FormGroup;
    parcelas: Parcela[] = [];
    lineasProduccion: LineaDeProduccion[] = [];
    insertar = false;
    solicitud: Solicitud;
    consejoPopulares: ConsejoPopular[] = [];
    tipoUso: TipoUso;
    persona: Persona;
    personas: Persona[] = [];
    tipoPersona: string;
    listPersonaAyuda: PersonaAyuda[] = [];
    indexStepper: number = 0;
    municipio: Municipio;
    ci: string;
    organizaciones: Integracion[] = [];

    displayedColumnsParcela: string[] = ['contador', 'zonaCatastral', 'parcela', 'divicion', 'area', 'acciones'];
    displayedColumnsLinea: string[] = ['contador', 'lineaDeProduccion', 'areaDedicada', 'acciones'];
    displayedColumnsPersonaAyuda: string[] = ['contador', 'ci', 'nombre', 'primerApellido', 'segundoApellido', 'parentesco', 'acciones'];
    dataSourceParcela = new MatTableDataSource<Parcela>();
    dataSourceLinea = new MatTableDataSource<LineaDeProduccion>();
    dataSourcePersonaAyuda = new MatTableDataSource<PersonaAyuda>();
    public personasFiltradas: ReplaySubject<Persona[]> = new ReplaySubject<Persona[]>(1);
    public consejoPopularFiltrados: ReplaySubject<ConsejoPopular[]> = new ReplaySubject<ConsejoPopular[]>(1);

    constructor(public dialogRef: MatDialogRef<SolicitudWindowComponent>, @Inject(MAT_DIALOG_DATA){id, municipio, tipoDecreto = '300', tipoSolicitud = 'Nueva', fechaSolicitud = new Date(), numExpediente, persona, parcelas, lineasDeProduccion, areaSolicitada, estado = 'Por Tramitar', detallesMT}: Solicitud, private service: SolicitudService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoUsoService, private personaService: PersonaService, private municipioService: MunicipioService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.municipio = municipio;
        this.idSolicitud = id;
        if (this.insertar) {
            this.persona = new Persona();
            this.persona.tipoPersona = 'Natural';
        } else {
            this.persona = persona;
            this.parcelas = parcelas;
            this.lineasProduccion = lineasDeProduccion;
            this.listPersonaAyuda = persona.personasAyuda;
        }
        //this.tipoPersona = this.persona.tipoPersona;
        //this.checked = false;

        this.formSolicitud = new FormGroup({
            municipio: new FormControl(municipio),
            tipoDecreto: new FormControl(tipoDecreto),
            tipoSolicitud: new FormControl(tipoSolicitud, [Validators.required]),
            fechaSolicitud: new FormControl(fechaSolicitud),
            numExpediente: new FormControl(numExpediente, [Validators.required]),
            areaSolicitada: new FormControl(areaSolicitada, [Validators.required]),
            detallesMT: new FormControl(detallesMT, [Validators.required]),
            estado: new FormControl(estado),
        });

        this.formPersona = new FormGroup({
            tipoPersona: new FormControl(this.persona.tipoPersona, [Validators.required]),
            consejoPopular: new FormControl(this.persona.consejoPopular, [Validators.required]),
            ci: new FormControl(this.persona.ci, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
            nombre: new FormControl(this.persona.nombre, [Validators.required]),
            primerApellido: new FormControl(this.persona.primerApellido, [Validators.required]),
            segundoApellido: new FormControl(this.persona.segundoApellido, [Validators.required]),
            sexo: new FormControl(this.persona.sexo, [Validators.required]),
            dirParticular: new FormControl(this.persona.dirParticular, [Validators.required]),
            edad: new FormControl(this.persona.edad, []),
            movil: new FormControl(this.persona.movil, [Validators.required, Validators.maxLength(8)]),
            telFijo: new FormControl(this.persona.telFijo, [Validators.required, Validators.maxLength(8)]),
            situacionLaboral: new FormControl(this.persona.situacionLaboral, [Validators.required]),
            integraciones: new FormArray([]),
            asociado: new FormControl(this.persona.asociado, [Validators.required]),
            parentesco: new FormControl('Vinculacion', [Validators.required]),
        });

        this.formPersonaAyuda = new FormGroup({
            contador: new FormControl(0, []),
            ci: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
            nombre: new FormControl('', [Validators.required]),
            primerApellido: new FormControl('', [Validators.required]),
            segundoApellido: new FormControl('', [Validators.required]),
            parentesco: new FormControl('', [Validators.required]),
        });

        this.formParcela = new FormGroup({
            contador: new FormControl(0, []),
            consejoPopular: new FormControl('', [Validators.required]),
            tipoUso: new FormControl('', [Validators.required]),
            zonaCatastral: new FormControl('', [Validators.required]),
            parcela: new FormControl('', [Validators.required]),
            divicion: new FormControl('', []),
            direccion: new FormControl('', [Validators.required]),
            area: new FormControl('', [Validators.required]),
            limiteN: new FormControl('', []),
            limiteS: new FormControl('', []),
            limiteE: new FormControl('', []),
            limiteW: new FormControl('', []),
            condicActual: new FormControl('', [])
        });

        this.formLineaProduccion = new FormGroup({
            contador: new FormControl(0, []),
            lineaDeProduccion: new FormControl('', [Validators.required]),
            areaDedicada: new FormControl('', [Validators.required]),
        });


        this.formPersona.get('ci').valueChanges.subscribe(value => {
            if (this.formPersona.get('ci').valid) {
                if (this.ci != value) {
                    this.ci = value;
                    this.personaService.obtenerPorCI(value).subscribe(resp => {
                        if (resp.body.success && resp.body.elemento) {
                            this.formPersona.patchValue(resp.body.elemento);
                        } else {
                            if (this.formPersona.get('tipoPersona').value == 'Natural') {
                                this.formPersona.get('edad').setValue(this.obtenerEdad());
                            }
                        }
                    });
                }
            } else {
                this.resetForm('Persona');
            }
        });


    }

    ngOnInit() {
        if (this.insertar) {
            console.log(this.insertar);

            this.consejoPopularService.listarConsejoPopularNoDefinido('No Definido').subscribe(resp => {
                if (resp.body.success) {
                    this.consejoPopulares = resp.body.elementos;
                    this.formParcela.get('consejoPopular').setValue(resp.body.elemento);
                }
            });

            this.tipodeUsoService.listarTipoUsoPorNombre('Ociosa').subscribe(resp => {
                if (resp.body.success) {
                    this.formParcela.get('tipoUso').setValue(resp.body.elemento);
                }
                console.log(this.formParcela.value);
            });

            this.municipioService.obtenerMunicipioPorCodigo('02').subscribe(resp => {
                if (resp.body.success) {
                    this.formSolicitud.get('municipio').setValue(resp.body.elemento);
                }
            });

            this.service.obtenerUltimSolicitud().subscribe(resp => {
                if (resp.body.success && resp.body.total != 0) {
                    this.formSolicitud.get('numExpediente').setValue((resp.body.elemento.numExpediente) + 1);
                }
            });

            console.log(this.formSolicitud.value);

        } else {

            this.dataSourceParcela= new MatTableDataSource<Parcela>(this.parcelas);

            this.dataSourcePersonaAyuda = new MatTableDataSource<PersonaAyuda>(this.persona.personasAyuda);

            this.dataSourceLinea = new MatTableDataSource<LineaDeProduccion>(this.lineasProduccion);
        }

        this.listarTipoPersonaJuridica();

        this.personaService.listarIntegraciones().subscribe(integraciones => {
            this.organizaciones = integraciones;
            console.log(integraciones);
            const formArray = <FormArray>this.formPersona.get('integraciones') as FormArray;
            this.persona.integraciones.forEach(integracion => {
                formArray.push(new FormControl(integracion));
            });
        });

        this.consejoPopularService.listarTodasConsejoPopular().subscribe(resp => {
            if (resp.body.success) {
                this.consejoPopulares = resp.body.elementos;
                this.consejoPopularFiltrados.next(this.consejoPopulares);
            }
        });

       /* this.personaService.listarTodasPersona().subscribe(resp => {
            this.personas = resp.body.elementos;
        });*/
    }

    abrirVentana() {
        let dialogRef = this.dialog.open(PersonaWindowsComponent, {
            width: '400px', disableClose: true, data: new Persona('Juridica'),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '400px', data: {mensaje: 'Se ha insertado la persona juridica: ' + result.elemento.nombre}});
                this.listarTipoPersonaJuridica();
            }
        });
    }


    addParcela() {
        if (this.formParcela.valid) {
            if (this.dataSourceParcela.data.length === 0) {
                const parcela = this.formParcela.value as Parcela;
                this.parcelas.push(parcela);
                this.dataSourceParcela = new MatTableDataSource<Parcela>(this.parcelas);
            }
            /*else {
                           for (var cont in this.parcelas) {
                               if (this.parcelas[cont].zonaCatastral == this.formParcela.get('zonaCatastral').value && this.parcelas[cont].parcela == this.formParcela.get('parcela').value && this.parcelas[cont].divicion == this.formParcela.get('divicion').value) {
                                   esta = true;
                                   break;
                               }
                           }

                           if (esta != true) {
                               this.formParcela.get('contador').setValue(this.formParcela.get('contador').value + 1);
                               this.parcelas.push(this.formParcela.value);
                               this.dataSourceParcela = new MatTableDataSource<Parcela>(this.parcelas);
                           } else {
                               this.dialog.open(MensajeError, {
                                   width: '400px',
                                   data: {mensaje: 'La parcela ya se encuentra en la lista:'}
                               })
                           }
                       }*/
        }
    }

    addLineasProduccion() {
        let esta = false;
        if (this.formLineaProduccion.valid) {
            for (let lineaDeProduccion of this.lineasProduccion) {
                if (lineaDeProduccion.lineaDeProduccion == this.formLineaProduccion.get('lineaDeProduccion').value) {
                    esta = true;
                    break;
                }
            }

            if (esta != true) {
                this.formLineaProduccion.get('contador').setValue(this.formLineaProduccion.get('contador').value + 1);
                this.lineasProduccion.push(this.formLineaProduccion.value);
                this.dataSourceLinea = new MatTableDataSource<LineaDeProduccion>(this.lineasProduccion);
            } else {
                this.dialog.open(MensajeError, {
                    width: '400px',
                    data: {mensaje: 'La linea de producción ya se encuentra en la lista:'}
                })
            }
        }
    }

    addPersonaAyuda() {
        if (this.formPersonaAyuda.valid) {
            const value = this.formPersonaAyuda.get('ci').value;
            const esta = this.listPersonaAyuda.some(personaAyuda => personaAyuda.ci == value);
            if (!esta) {
                this.formPersonaAyuda.get('contador').setValue(this.formPersonaAyuda.get('contador').value + 1);
                this.listPersonaAyuda.push(this.formPersonaAyuda.value);
                this.dataSourcePersonaAyuda = new MatTableDataSource<PersonaAyuda>(this.listPersonaAyuda);
            } else {
                this.dialog.open(MensajeError, {
                    width: '400px',
                    data: {mensaje: 'La persona ya se encuentra en la lista:'}
                })
            }
        }
    }

    listarTipoPersonaJuridica() {
        this.personaService.listarPorTipoPersona('Juridica').subscribe(resp => {
            if (resp.body.success) {
                this.personas = resp.body.elementos;
                this.personasFiltradas.next(this.personas);
            }
        });
    }

    public selectionChange($event ?: StepperSelectionEvent): void {
        this.indexStepper = $event.selectedIndex;
    }

    controlStepper(stepper: MatStepper, next: boolean): void {
        if (next) {
            stepper.next();
        } else {
            stepper.previous();
        }
    }

    obtenerEdad(): number {
        let str = new String(this.ci);
        const anio: number = parseInt(str.charAt(0) + '' + str.charAt(1));
        const mes: number = parseInt(str.charAt(2) + '' + str.charAt(3));
        const dia: number = parseInt(str.charAt(4) + '' + str.charAt(5));
        let anioA: number = new Date().getFullYear() - 2000;
        let mesA: number = new Date().getMonth() + 1;
        let diaA: number = new Date().getDate();
        let edad: number;

        if (mes == mesA) {
            if (diaA > dia || diaA == dia) {
                edad = 100 - anio + anioA;
            } else {
                edad = 100 - anio + anioA - 1;
            }
        } else if (mesA > mes) {
            edad = 100 - anio + anioA;
        } else {
            edad = 100 - anio + anioA - 1;
        }

        str = new String(edad);
        if (str.length == 3) {
            edad = parseInt(str.slice(1));
        }
        return edad;
    }

    insertarSolicitud(): void {
        if (this.formSolicitud.valid && this.formPersona.valid && this.formPersonaAyuda.valid && this.formParcela.valid && this.formLineaProduccion.valid) {
            const solicitud = this.formSolicitud.value as Solicitud;
            solicitud.persona = {...this.formPersona.value};
            solicitud.persona.personasAyuda = [...this.listPersonaAyuda];
            solicitud.parcelas = [...this.parcelas];
            solicitud.lineasDeProduccion = [...this.lineasProduccion];
            this.solicitud = solicitud;
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarSolicitud(this.solicitud).subscribe(resp => {
                    let appResp = resp.body;
                    if (appResp.success) {
                        this.dialogRef.close(appResp);
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
        else {
            const solicitud = this.formSolicitud.value as Solicitud;
            solicitud.persona = {...this.formPersona.value};
            solicitud.persona.personasAyuda = [...this.listPersonaAyuda];
            solicitud.parcelas = [...this.parcelas];
            solicitud.lineasDeProduccion = [...this.lineasProduccion];
            this.solicitud = solicitud;
        }
    }

    compararPersonas(inicio: Persona, fin: Persona) {
        return inicio && fin && inicio.id === fin.id;
    }

    compararConsejoPopulares(inicio: ConsejoPopular, fin: ConsejoPopular) {
        return inicio && fin && inicio.id === fin.id;
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onChange(event) {
        const integraciones = <FormArray>this.formPersona.get('integraciones') as FormArray;
        if (event.checked) {
            integraciones.push(new FormControl(event.source.value))
        } else {
            const i = integraciones.controls.findIndex(x => x.value === event.source.value);
            integraciones.removeAt(i);
        }
    }

    resetForm(form: string) {
        if (form == 'Persona') {
            this.formPersona.get('nombre').reset();
            this.formPersona.get('primerApellido').reset();
            this.formPersona.get('segundoApellido').reset();
            this.formPersona.get('sexo').setValue('M');
            this.formPersona.get('edad').reset();
            this.formPersona.get('telFijo').reset();
            this.formPersona.get('movil').reset();
            this.formPersona.get('situacionLaboral').reset();
        }
    }

    tieneIntegracion(organizacion: Integracion): boolean {
        return this.persona.integraciones.some(value => value.id === organizacion.id);

    }
}
