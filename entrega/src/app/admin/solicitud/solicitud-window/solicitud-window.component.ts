import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
    FloatLabelType,
    MAT_DATE_FORMATS,
    MAT_DIALOG_DATA, MatCheckbox,
    MatDialog,
    MatDialogRef,
    MatHorizontalStepper, MatStepper, matStepperAnimations,
    MatTableDataSource
} from '@angular/material';
import {
    ConsejoPopular,
    LineaDeProduccion,
    Municipio,
    Parcela,
    Persona,
    Provincia,
    Solicitud,
    TipoDeUso
} from '../../../modelo';
import {CheckboxControlValueAccessor, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Information, MensajeError} from '../../../mensaje/window.mensaje';
import {ConsejoPopularService} from '../../../servicios/consejo-popular.service';
import {TipoDeUsoService} from '../../../servicios/tipo-de-uso.service';
import {SolicitudService} from '../../../servicios/solicitud.service';
import {PersonaService} from '../../../servicios/persona.service';
import {Observable, ReplaySubject} from 'rxjs/index';
import {PersonaWindowsComponent} from '../../solicitante/persona-windows/persona-windows.component';
import {SelectionModel} from '@angular/cdk/collections';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MunicipioService} from "../../../servicios/municipio.service";
import {map, startWith} from "rxjs/internal/operators";
import {PersonaPipe} from "../../../pipes/persona.pipe";
import {and, forEach} from "@angular/router/src/utils/collection";
import {Error} from "tslint/lib/error";
import {isLineBreak} from "codelyzer/angular/sourceMappingVisitor";
import {DatePipe, formatDate} from "@angular/common";

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
    formBuilder:FormBuilder;
    idSolicitud: number;
    formSolicitud: FormGroup;
    formParcela: FormGroup;
    formPersona: FormGroup;
    formPersonaAyuda:FormGroup;
    formLineaProduccion: FormGroup;
    parcelas: Parcela[] = [];
    lineasProduccion: LineaDeProduccion[] = [];
    insertar = false;
    solicitud: Solicitud;
    consejoPopulares: ConsejoPopular[]=[];
    tipoDeUso: TipoDeUso;
    startDate = new Date(1988, 0, 1);
    personas: Persona[]=[];
    indexStepper: number =0;
    municipio:Municipio;
    //datePipe: DatePipe = new DatePipe(undefined);
    ci:string;

    organizaciones = ['PCC','CTC','ANAP','MTT','CDR', 'ACRC','FMC',];

    displayedColumnsParcela: string[] = ['contador', 'zonaCatastral', 'parcela', 'divicion','direccion','area', 'acciones'];
    displayedColumnsLinea: string[] = ['contador','lineaDeProduccion', 'areaDedicada', 'acciones'];
    displayedColumnsPersonaAyuda: string[] = ['contador','ci', 'nombre','primerApellido','segundoApellido','parentesco','acciones'];
    dataSourceParcela = new MatTableDataSource<Parcela>();
    dataSourceLinea = new MatTableDataSource<LineaDeProduccion>();
    dataSourcePersonaAyuda = new MatTableDataSource<Persona>();
    public personasFiltradas: ReplaySubject<Persona[]> = new ReplaySubject<Persona[]>(1);
    public consejoPopularFiltrados: ReplaySubject<ConsejoPopular[]> = new ReplaySubject<ConsejoPopular[]>(1);

    constructor(public dialogRef: MatDialogRef<SolicitudWindowComponent>,
                @Inject(MAT_DIALOG_DATA){id, municipio, tipoDecreto = '300', tipoSolicitud = 'Nueva', fechaSolicitud = new Date(), numExpediente, persona, parcelas, lineasDeProduccion, areaSolicitada, estado = 'Por Tramitar',detallesMT}: Solicitud,
                @Inject(MAT_DIALOG_DATA){tipoPersona = 'Natural',consejoPopular, ci, nombre, primerApellido, segundoApellido, sexo = 'M', dirParticular, fechaNacimiento, movil, telFijo, situacionLaboral, asociado, parentesco, integracion}: Persona,
                private service: SolicitudService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoDeUsoService, private personaService: PersonaService,private municipioService:MunicipioService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.municipio = municipio;
        this.idSolicitud = id;

        //this.checked = false;

        this.formSolicitud = new FormGroup({
            municipio: new FormControl(municipio),
            tipoDecreto: new FormControl(tipoDecreto),
            tipoSolicitud: new FormControl(tipoSolicitud, [Validators.required]),
            fechaSolicitud: new FormControl(fechaSolicitud),
            numExpediente: new FormControl(numExpediente, [Validators.required]),
            areaSolicitada: new FormControl(areaSolicitada, [Validators.required]),
            detallesMT: new FormControl(detallesMT,[Validators.required]),
            estado: new FormControl(estado),
        });

        this.formPersona = new FormGroup({
            tipoPersona: new FormControl(tipoPersona, [Validators.required]),
            consejoPopular: new FormControl(consejoPopular, [Validators.required]),
            ci: new FormControl(ci, [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
            nombre: new FormControl(nombre, [Validators.required]),
            primerApellido: new FormControl(primerApellido, [Validators.required]),
            segundoApellido: new FormControl(segundoApellido, [Validators.required]),
            sexo: new FormControl(sexo, [Validators.required]),
            dirParticular: new FormControl(dirParticular, [Validators.required]),
            fechaNacimiento: new FormControl(fechaNacimiento, [Validators.required]),
            movil: new FormControl(movil, [Validators.required, Validators.maxLength(8)]),
            telFijo: new FormControl(telFijo, [Validators.required, Validators.maxLength(8)]),
            situacionLaboral: new FormControl(situacionLaboral, [Validators.required]),
            integracion: this.buildOrganizaciones(),
            asociado: new FormControl(asociado, [Validators.required])
        });

        this.formPersonaAyuda = new FormGroup({
            contador: new FormControl(0, []),
            ci: new FormControl('', [Validators.required, Validators.maxLength(11)]),
            nombre: new FormControl('', [Validators.required]),
            primerApellido: new FormControl('', [Validators.required]),
            segundoApellido: new FormControl('', [Validators.required]),
            parentesco: new FormControl('', [Validators.required])
        });

        this.formParcela = new FormGroup({
            contador: new FormControl(0, []),
            consejoPopular: new FormControl('', [Validators.required]),
            tipoDeUso: new FormControl('', [Validators.required]),
            zonaCatastral: new FormControl('', [Validators.required]),
            parcela: new FormControl('', [Validators.required]),
            divicion: new FormControl(''),
            direccion: new FormControl('', [Validators.required]),
            area: new FormControl('', [Validators.required]),
            limiteN: new FormControl(''),
            limiteS: new FormControl(''),
            limiteE: new FormControl(''),
            limiteW: new FormControl(''),
            condicActual: new FormControl('')
        });

        this.formLineaProduccion = new FormGroup({
            contador: new FormControl(0, []),
            lineaDeProduccion: new FormControl('', [Validators.required]),
            areaDedicada: new FormControl('', [Validators.required]),
        });

        this.formPersona.get('ci').valueChanges.subscribe(value => {
            if (this.formPersona.get('ci').valid){
                if (this.ci != value){
                    this.ci = value;
                    console.log(value);
                    this.personaService.obtenerPorCI(value).subscribe(resp=>{
                        if (resp.body.success && resp.body.elemento){
                            this.formPersona.patchValue(resp.body.elemento);
                            this.formPersona.get('fechaNacimiento').setValue(new Date(resp.body.elemento.fechaNacimiento));
                        }else {
                            this.formPersona.reset();
                            this.formPersona.get('ci').setValue(this.ci);
                            this.formPersona.get('tipoPersona').setValue('Natural');

                        }
                    });
                }
            }
        })

        this.formParcela.valueChanges.subscribe(value => {
            if (this.formParcela.get('zonaCatastral').value && this.formParcela.get('parcela').value && this.formParcela.get('divicion').value) {
            }
        });
    }

    ngOnInit() {

        if (this.insertar) {

            this.consejoPopularService.listarConsejoPopularNoDefinido('No Definido').subscribe(resp => {
                if (resp.body.success) {
                    this.formParcela.get('consejoPopular').setValue(resp.body.elemento);
                }
            });

            this.tipodeUsoService.listarTipoDeUsoNoDefinido('No Definido').subscribe(resp => {
                if (resp.body.success) {
                    this.formParcela.get('tipoDeUso').setValue(resp.body.elemento);
                }
            });

            this.municipioService.obtenerMunicipioPorCodigo('02').subscribe(resp=>{
               if (resp.body.success){
                   this.formSolicitud.get('municipio').setValue(resp.body.elemento);
               }
            });

            this.listarTipoPersonaJuridica();

            this.service.obtenerUltimSolicitud().subscribe(resp => {
                if (resp.body.success) {
                    this.formSolicitud.get('numExpediente').setValue((resp.body.elemento.numExpediente) + 1);
                }
            });
        }

        this.consejoPopularService.listarTodasConsejoPopular().subscribe(resp =>{
            if (resp.body.success){
                this.consejoPopulares = resp.body.elementos;
                this.consejoPopularFiltrados.next(this.consejoPopulares);
            }
        });

        console.log(this.formSolicitud.value);

    }

    buildOrganizaciones(){
        const values = this.organizaciones.map(v => new FormControl(false))
        return this.formBuilder.array(values);
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
                    data: {mensaje: 'Se ha insertado la persona juridica:' + result.elemento.nombre}
                });
                this.listarTipoPersonaJuridica();
            }
        });
    }

    addParcela() {
        let esta = false;
        if (this.formParcela.valid) {
            for (var cont in this.parcelas){
                if (this.parcelas[cont].zonaCatastral == this.formParcela.get('zonaCatastral').value && this.parcelas[cont].parcela == this.formParcela.get('parcela').value && this.parcelas[cont].divicion == this.formParcela.get('divicion').value) {
                    esta = true;
                    break;
                }
            }

            if (esta != true){
                this.formParcela.get('contador').setValue(this.formParcela.get('contador').value + 1);
                this.parcelas.push(this.formParcela.value);
                this.dataSourceParcela = new MatTableDataSource<Parcela>(this.parcelas);
            }else {
                this.dialog.open(MensajeError, {
                    width: '400px',
                    data: {mensaje: 'La parcela ya se encuentra insertada:'}
                })
            }
        }
    }

    addLineasProduccion() {
        if (this.formLineaProduccion.valid) {
            this.formLineaProduccion.get('contador').setValue(this.formLineaProduccion.get('contador').value + 1);
            this.lineasProduccion.push(this.formLineaProduccion.value);
            this.dataSourceLinea = new MatTableDataSource<LineaDeProduccion>(this.lineasProduccion);
        }
    }

    listarTipoPersonaJuridica() {
        this.personaService.listarPorTipoPersona('Juridica').subscribe(resp => {
            if (resp.body.success) {
                this.personas = resp.body.elementos;
                console.log(this.personas );
                this.personasFiltradas.next(this.personas);
                console.log(this.personasFiltradas);
            }
        });
    }

    public selectionChange($event?: StepperSelectionEvent): void {
        this.indexStepper = $event.selectedIndex;
    }

    controlStepper (stepper:MatStepper, next:boolean):void{
        if (next){
            stepper.next();
        }else {
            stepper.previous();
        }
    }

   /* onChecked (chekec:MatCheckbox,valor:string, event:Event):void{
        event.stopPropagation();

        console.log(chekec);
            this.formPersona.get('integracion').setValue('');
            console.log(valor);
            for (let cont of this.organizaciones){
                if (cont.name === valor){
                    console.log(cont);
                    if (cont.checked === 'true' || cont.checked === '' ){
                        cont.checked = 'false';
                       chekec._onInputClick(event);
                       chekec.checked = false;
                        // = false;
                        console.log('if');
                        //break;

                    }else{
                        console.log('else');
                        cont.checked = 'true';
                        chekec.checked = true;
                       // break;
                    }
                    console.log(cont);
                    console.log(chekec);
                }

            }
            for (let cont of this.organizaciones){
                if (cont.checked==='true'){
                    if (!this.formPersona.get('integracion').value){
                        this.formPersona.get('integracion').setValue(cont.name);
                    } else {
                        this.formPersona.get('integracion').setValue(this.formPersona.get('integracion').value+","+cont.name);
                    }

                }
            }

            console.log(this.organizaciones);
            console.log(this.formPersona.get('integracion').value);
    }*/



    insertarSolicitud(): void {
        if (this.formSolicitud.valid && this.formPersona.valid && this.formParcela.valid && this.formLineaProduccion.valid) {
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
        }else{
            const solicitud = this.formSolicitud.value;
            solicitud.persona = {...this.formPersona.value};
            solicitud.parcelas = [...this.parcelas];
            solicitud.lineasDeProduccion = [...this.lineasProduccion];
            this.solicitud = solicitud;
            console.log(this.solicitud);
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
}
