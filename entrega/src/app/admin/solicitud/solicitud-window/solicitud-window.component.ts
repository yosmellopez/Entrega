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
    TipoDeUso, Usuario
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
import {Data} from "@angular/router";
import {parseIntAutoRadix} from "@angular/common/src/i18n/format_number";

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
    formPersonaAyuda:FormGroup;
    formLineaProduccion: FormGroup;
    parcelas: Parcela[] = [];
    lineasProduccion: LineaDeProduccion[] = [];
    insertar = false;
    solicitud: Solicitud;
    consejoPopulares: ConsejoPopular[]=[];
    tipoDeUso: TipoDeUso;
    persona: Persona;
    personas: Persona[]=[];
    tipoPersona: string;
    listPersonaAyuda: Persona[]=[];
    indexStepper: number =0;
    municipio:Municipio;
    //datePipe: DatePipe = new DatePipe(undefined);
    ci:string;

    organizaciones =[{name:'PCC',activo:false},
                    {name:'CTC',activo:false},
                    {name:'ANAP',activo:false},
                    {name:'MTT',activo:false},
                    {name:'CDR',activo:false},
                    {name:'ACRC',activo:false},
                    {name:'FMC',activo:false}];

    displayedColumnsParcela: string[] = ['contador', 'zonaCatastral', 'parcela', 'divicion','direccion','area', 'acciones'];
    displayedColumnsLinea: string[] = ['contador','lineaDeProduccion', 'areaDedicada', 'acciones'];
    displayedColumnsPersonaAyuda: string[] = ['contador','ci', 'nombre','primerApellido','segundoApellido','parentesco','acciones'];
    dataSourceParcela = new MatTableDataSource<Parcela>();
    dataSourceLinea = new MatTableDataSource<LineaDeProduccion>();
    dataSourcePersonaAyuda = new MatTableDataSource<Persona>();
    public personasFiltradas: ReplaySubject<Persona[]> = new ReplaySubject<Persona[]>(1);
    public consejoPopularFiltrados: ReplaySubject<ConsejoPopular[]> = new ReplaySubject<ConsejoPopular[]>(1);

    constructor( public dialogRef: MatDialogRef<SolicitudWindowComponent>, @Inject(MAT_DIALOG_DATA){id, municipio, tipoDecreto = '300', tipoSolicitud = 'Nueva', fechaSolicitud = new Date(), numExpediente, persona, parcelas, lineasDeProduccion, areaSolicitada, estado = 'Por Tramitar',detallesmt}: Solicitud, private service: SolicitudService, private consejoPopularService: ConsejoPopularService, private tipodeUsoService: TipoDeUsoService, private personaService: PersonaService,private municipioService:MunicipioService, private dialog: MatDialog) {
        this.insertar = id == null;
        this.municipio = municipio;
        this.idSolicitud = id;
        this.parcelas = parcelas;
        this.lineasProduccion = lineasDeProduccion;
        if (this.insertar){
            this.persona = new Persona();
            this.persona.tipoPersona = 'Natural';
        }else{
            this.persona = persona;
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
            detallesMT: new FormControl(detallesmt,[Validators.required]),
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
            edad: new FormControl(this.persona.edad, [Validators.required]),
            movil: new FormControl(this.persona.movil, [Validators.required, Validators.maxLength(8)]),
            telFijo: new FormControl(this.persona.telFijo, [Validators.required, Validators.maxLength(8)]),
            situacionLaboral: new FormControl(this.persona.situacionLaboral, [Validators.required]),
            integracion: new FormControl(this.persona.integracion),
            asociado: new FormControl(this.persona.asociado, [Validators.required]),
            parentesco: new FormControl('Vinculacion', [Validators.required]),
        });

        this.formPersonaAyuda = new FormGroup({
            tipoPersona: new FormControl('Natural', [Validators.required]),
            contador: new FormControl(0, []),
            ci: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
            nombre: new FormControl('', [Validators.required]),
            primerApellido: new FormControl('', [Validators.required]),
            segundoApellido: new FormControl('', [Validators.required]),
            parentesco: new FormControl('', [Validators.required]),
            consejoPopular: new FormControl('', [Validators.required]),
            edad: new FormControl('', [Validators.required]),
            sexo: new FormControl('', [Validators.required]),
            movil: new FormControl('-'),
            telFijo: new FormControl('-'),
            situacionLaboral: new FormControl('-'),
            dirParticular: new FormControl('-'),
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
                        }else {
                            if (this.formPersona.get('tipoPersona').value == 'Natural'){
                                this.formPersona.get('edad').setValue(this.obtenerEdad());
                                this.formPersona.get('sexo').setValue(this.obtenerSexo());
                            }
                        }
                    });
                }
            }else {
                this.resetForm('Persona');
            }
        });

        this.formPersonaAyuda.get('ci').valueChanges.subscribe(value => {

            if (this.formPersonaAyuda.get('ci').valid){
                if (this.ci != value) {

                    this.ci = value;
                    console.log(value);
                    this.formPersonaAyuda.get('edad').setValue(this.obtenerEdad());
                    this.formPersonaAyuda.get('sexo').setValue(this.obtenerSexo());
                }
            }
        });

        this.formParcela.valueChanges.subscribe(value => {
            if (this.formParcela.get('zonaCatastral').value && this.formParcela.get('parcela').value && this.formParcela.get('divicion').value) {
            }
        });
    }

    ngOnInit() {

        if (this.insertar) {
            console.log(this.insertar);

            this.consejoPopularService.listarConsejoPopularNoDefinido('No Definido').subscribe(resp => {
                if (resp.body.success) {
                    this.formParcela.get('consejoPopular').setValue(resp.body.elemento);
                    this.formPersonaAyuda.get('consejoPopular').setValue(resp.body.elemento);
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

            this.service.obtenerUltimSolicitud().subscribe(resp => {
                if (resp.body.success && resp.body.total!=0) {
                    this.formSolicitud.get('numExpediente').setValue((resp.body.elemento.numExpediente) + 1);
                }
            });

            console.log(this.formSolicitud.value);
        }else{
            const arrOrganizacion = this.persona.integracion.split(',');
            console.log(arrOrganizacion);
            for (let organizacion of this.organizaciones ){

            }

            this.dataSourceParcela= new MatTableDataSource<Parcela>(this.parcelas);
            this.dataSourceLinea = new MatTableDataSource<LineaDeProduccion>(this.lineasProduccion);
        }

        this.listarTipoPersonaJuridica();

        this.consejoPopularService.listarTodasConsejoPopular().subscribe(resp =>{
            if (resp.body.success){
                this.consejoPopulares = resp.body.elementos;
                this.consejoPopularFiltrados.next(this.consejoPopulares);
            }
        });

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
                    data: {mensaje: 'La parcela ya se encuentra en la lista:'}
                })
            }
        }
    }

    addLineasProduccion() {
        let esta = false;
        if (this.formLineaProduccion.valid) {
            for (let lineaDeProduccion of this.lineasProduccion){
                if (lineaDeProduccion.lineaDeProduccion == this.formLineaProduccion.get('lineaDeProduccion').value) {
                    esta = true;
                    break;
                }
            }

            if (esta != true){
                this.formLineaProduccion.get('contador').setValue(this.formLineaProduccion.get('contador').value + 1);
                this.lineasProduccion.push(this.formLineaProduccion.value);
                this.dataSourceLinea = new MatTableDataSource<LineaDeProduccion>(this.lineasProduccion);
            }else {
                this.dialog.open(MensajeError, {
                    width: '400px',
                    data: {mensaje: 'La linea de producción ya se encuentra en la lista:'}
                })
            }
        }
    }

    addPersonaAyuda() {
        let esta = false;
        if (this.formPersonaAyuda.valid) {
            for (let personaAyuda of this.listPersonaAyuda){
                if (personaAyuda.ci == this.formPersonaAyuda.get('ci').value) {
                    esta = true;
                    break;
                }
            }

            if (esta != true){
                this.formPersonaAyuda.get('contador').setValue(this.formPersonaAyuda.get('contador').value + 1);
                this.listPersonaAyuda.push(this.formPersonaAyuda.value);
                this.dataSourcePersonaAyuda = new MatTableDataSource<Persona>(this.listPersonaAyuda);
            }else {
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

    obtenerEdad():number{
        var str = new String(this.ci);
        const anio: number = parseInt(str.charAt(0)+''+str.charAt(1));
        const mes: number = parseInt(str.charAt(2)+''+str.charAt(3));
        const dia: number = parseInt(str.charAt(4)+''+str.charAt(5));

        var anioA: number = new Date().getFullYear()-2000;
        var mesA: number = new Date().getMonth()+1;
        var diaA: number = new Date().getDate();


        var edad:number;

        if (mes == mesA){
            if (diaA>dia || diaA==dia ){
                edad = 100-anio+anioA;
            }else {
                edad = 100-anio+anioA-1;
            }
        } else if (mesA > mes ){
            edad = 100-anio+anioA;
        } else {
            edad = 100-anio+anioA-1;
        }

       str = new String (edad);

        if(str.length == 3){
            edad = parseInt(str.slice(1));
        }

        return edad;
    }

    obtenerSexo():string{
        var str = new String(this.ci);
        const sexoCI: number = parseInt(str.charAt(9));

        if (sexoCI % 2 === 0){
            return 'M';
        }else{
            return 'F';
        }
    }

    agregarIntgra(valor:string){
        if (!this.formPersona.get('integracion').value){
            this.formPersona.get('integracion').setValue(valor);
        } else {
            this.formPersona.get('integracion').setValue(this.formPersona.get('integracion').value+","+valor);
        }
        console.log(this.formPersona.get('integracion').value);
    }

    quitarIntgra(valor:string){
        var str = this.formPersona.get('integracion').value;
        var arregIntegra = str.split(",");
        console.log(arregIntegra);

        for (var cont in arregIntegra){
            console.log(cont);
            if (arregIntegra[cont] == valor){
                arregIntegra.splice(cont,1);
                break;
            }
            console.log(arregIntegra[cont]);
        }

        this.formPersona.get('integracion').setValue(arregIntegra.toString());

        //arrayIntegracion.split(,);
        console.log(arregIntegra);
        console.log(this.formPersona.get('integracion').value);
    }

    insertarSolicitud(): void {
        if (this.formSolicitud.valid && this.formPersona.valid && this.formPersonaAyuda.valid && this.formParcela.valid && this.formLineaProduccion.valid) {
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
                        for (let personaAyuda of this.listPersonaAyuda){
                            personaAyuda.asociado = appResp.elemento.persona;
                        }
                        this.personaService.insertarlistPersona(this.listPersonaAyuda).subscribe(resp=>{
                            if (resp.body.success ){
                                console.log(resp.body.elementos);
                            }
                        });
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
        }else{
            const solicitud = this.formSolicitud.value;
            solicitud.persona = {...this.formPersona.value};
            solicitud.persona.perosnas = [...this.listPersonaAyuda];
            solicitud.parcelas = [...this.parcelas];
            solicitud.lineasDeProduccion = [...this.lineasProduccion];
            this.solicitud = solicitud;
            console.log(this.solicitud);
            for (let personaAyuda of this.listPersonaAyuda){
                personaAyuda.asociado = this.formPersona.value;
                console.log(personaAyuda);
            }
            console.log(this.listPersonaAyuda);
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

    resetForm(form:string){
        if (form == 'Persona'){
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
}
