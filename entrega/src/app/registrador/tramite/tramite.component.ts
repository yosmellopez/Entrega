import {Component, OnInit, ViewChild} from '@angular/core';
import {TramiteService} from "../../servicios/tramite.service";
import {MatDialog, MatPaginator, MatSort, MatTabGroup, MatTable, MatTableDataSource} from "@angular/material";
import {
    Bienhechuria,
    LineaDeProduccion,
    Parcela,
    ParcelaBienhechuria,
    Persona,
    Regulacion,
    Solicitud
} from "../../modelo";
import {RegulacionService} from "../../servicios/regulacion.service";
import {BienhechuriaService} from "../../servicios/bienhechuria.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Information, MensajeError} from "../../mensaje/window.mensaje";
import {PersonaWindowsComponent} from "../../admin/solicitante/persona-windows/persona-windows.component";
import {BienhechuriaWindowComponent} from "../bienhechurias/bienhechuria-window/bienhechuria-window.component";
import {DetallesSolicitudComponent} from "../../admin/solicitud/detalles-solicitud/detalles-solicitud.component";
import {PersonaDetallesComponent} from "../../admin/solicitante/persona-detalles/persona-detalles.component";
import {ActuParcelaWindowComponent} from "./actu-parcela-window/actu-parcela-window.component";
import {AprobarDenegarLPWindowComponent} from "./aprobar-denegar-lpwindow/aprobar-denegar-lpwindow.component";
import {AprobarDenegarSolicitudWindowsComponent} from "./aprobar-denegar-solicitud-windows/aprobar-denegar-solicitud-windows.component";
import {ReporteService} from "../../servicios/reporte.service";

export class ParcelaElement {
    idParcela:number;
    nombreCP:string
    numExpediente: number;
    ci: string;
    nombre_y_apellido: string;
    zc: string
    parcela: string;
    direccion: string;
    areaParc: number;

    constructor(idParcela:number, nombreCP:string, numExpediente:number, ci:string, nombre_y_apellido:string, zc:string, parcela:string, direccion: string, areaParc:number){
        this.idParcela = idParcela;
        this.nombreCP = nombreCP;
        this.numExpediente = numExpediente;
        this.ci = ci;
        this.nombre_y_apellido = nombre_y_apellido;
        this.zc = zc;
        this.parcela = parcela;
        this.direccion = direccion;
        this.areaParc = areaParc;
    }
}

export class LineaProducElement {
    numExpediente: number;
    id:number;
    lineaDeProduccion: string;
    areaDedicada: number;
    aprobado: string;
    estudioSuelo: string

    constructor(numExpediente:number, id:number, lineaDeProduccion:string, areaDedicada: number, aprobado: boolean, detallesApro: string){
        this.numExpediente = numExpediente;
        this.id = id;
        this.lineaDeProduccion = lineaDeProduccion;
        this.areaDedicada = areaDedicada;
        if (aprobado!=null){
           this.aprobado = aprobado? 'Aprobada':'Denegada';
        } else {
            this.aprobado = '';
        }

        this.estudioSuelo = detallesApro;
    }
}

export class RegulacionesElement {
    id: number;
    regulacion: string;
    activa:string;

    constructor(id:number, regulacion:string, activa: string){
        this.id = id;
        this.regulacion = regulacion;
        this.activa = activa;
    }
}

@Component({
  selector: 'app-tramite',
  templateUrl: './tramite.component.html',
  styleUrls: ['./tramite.component.css']
})
export class TramiteComponent implements OnInit {

    editarBien:boolean = false;
    idBienhech:number;
    aproDengPor:string = '';

    parcelaElem:ParcelaElement[]=[];
    lineaProducElement:LineaProducElement[]=[];
    regulacionesElemen:RegulacionesElement[]=[];
    solicitudInvest:Solicitud[]=[];
    solicitudesMedicion:Solicitud[]=[];
    solicitudesMedicRegul:Solicitud[]=[];
    solicitudesEstuSuelo:Solicitud[]=[];
    solicitudBienhech:Solicitud[]=[];

    bienhechurias:Bienhechuria[]=[];

    parcelasReg:Parcela[]=[];
    parcelaReg:Parcela=new Parcela();

    parcelasBien:Parcela[]=[];
    parcelaBien:Parcela=new Parcela();

    regulacionesAsigParcela:RegulacionesElement[]=[];

    formRegParcela:FormGroup;
    formBienParcela:FormGroup;
    formParcelaBienhechu:FormGroup;
    formSeletAprueba: FormGroup;

    dataSourceSolicInvest = new MatTableDataSource<Solicitud>();
    dataSourceSolicMedCatas = new MatTableDataSource<ParcelaElement>();
    dataSourceSolicADLineasProduc = new MatTableDataSource<LineaProducElement>();
    dataSourceParcelaBienhechu = new MatTableDataSource<ParcelaBienhechuria>();
    dataSourceSoliciAprobar = new MatTableDataSource<Solicitud>();

    displayedColumnsInvest = ['index','numExpediente', 'tipoSolicitud', 'ci', 'nombre_y_apellido','acciones'];
    displayedColumnsMedCatas = ['index','numExpediente','ci','nombre_y_apellido', 'parcela', 'direccion','areaParc','modificada', 'acciones'];
    displayedColumnsADLineasProduc = ['index','numExpediente','lineaDeProduccion', 'areaDedic', 'aprobaDesa','acciones'];
    displayedColumnsParcelaBienhechu = ['index','bienhechuria','cant', 'precio', 'importe','acciones'];
    displayedColumnsSoliciAprobar = ['index','numExpediente', 'tipoSolicitud','areaSolicitada','ci', 'nombre_y_apellido','acciones'];

    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    constructor(private dialog:MatDialog, private sevice:TramiteService, private regulacionService:RegulacionService,private bienhechuriaService:BienhechuriaService, private report:ReporteService) {

        this.formRegParcela = new FormGroup({
            solicitud: new FormControl([]),
            parcela: new FormControl([])
        });

        this.formBienParcela = new FormGroup({
            solicitud: new FormControl([]),
            parcela: new FormControl([])
        });

        this.formParcelaBienhechu = new FormGroup({
            bienhechuria: new FormControl('',[Validators.required]),
            cantidad: new FormControl('',[Validators.required]),
            precio: new FormControl('',[Validators.required]),
        });

        this.formSeletAprueba = new FormGroup({
            aprueba: new FormControl('',[Validators.required])
        });

        this.formRegParcela.get('solicitud').valueChanges.subscribe(value => {
           this.parcelasReg = value.parcelas;
           this.formRegParcela.get('parcela').setValue(this.parcelasReg[0]);
        });

        this.formRegParcela.get('parcela').valueChanges.subscribe(value => {
            this.parcelaReg = value;
            if (value.regulaciones != null) {
                this.regulacionesAsigParcela = [];
                console.log(value)
                for (let element of value.regulaciones){
                    this.regulacionesAsigParcela.push(new RegulacionesElement(element.id,element.regulacion,''));
                }
            }
        });

        this.formBienParcela.get('solicitud').valueChanges.subscribe(value => {
            this.parcelasBien = value.parcelas;
            this.formBienParcela.get('parcela').setValue(this.parcelasBien[0]);
        });

        this.formBienParcela.get('parcela').valueChanges.subscribe(value => {
            this.parcelaBien = value;
            if (value.parcelaBienhechurias != null) {
                this.dataSourceParcelaBienhechu = new MatTableDataSource<ParcelaBienhechuria>(value.parcelaBienhechurias);
            }
            console.log(this.formParcelaBienhechu.value);
        });

        this.formSeletAprueba.get('aprueba').valueChanges.subscribe(value => {
            if (value == 'CA'){
                this.sevice.listarSolcAprobadoCAgraria().subscribe(listSolici => {
                   if (listSolici.body.success){
                       this.dataSourceSoliciAprobar=new MatTableDataSource<Solicitud>(listSolici.body.elementos);
                   }
                });
                this.aproDengPor = 'Comisión Agraria'
            } else {
                this.sevice.listarSolcFechaAprobadoPCC().subscribe(listSolici => {
                    if (listSolici.body.success){
                        this.dataSourceSoliciAprobar=new MatTableDataSource<Solicitud>(listSolici.body.elementos);
                    }
                });
                this.aproDengPor = 'PCC'
            }
        });
    }

    ngOnInit() {
        this.formSeletAprueba.get('aprueba').setValue('CA');

        this.listarSolicitudInvest();
        this.listarSolcMedic();
        this.listarSolcEstudioSuelo();
        this.listarSolcRegulci();
        this.listarSolcValoBienhechu()
        this.listarBienhechuria();

        this.regulacionService.listarAllRegulacion().subscribe(value => {
            if (value.body.success){
                for (let element of value.body.elementos){
                    this.regulacionesElemen.push(new RegulacionesElement(element.id,element.regulacion,''))
                    }
            }else {
                console.log(value.body.msg);
            }
        });

    }

    listarSolicitudInvest(){
        this.sevice.listarSolicitudInvest().subscribe(value => {
            if (value.body.success){
                this.solicitudInvest = value.body.elementos;
                this.dataSourceSolicInvest = new MatTableDataSource<Solicitud>(this.solicitudInvest);
            }else {
                console.log(value.body.msg);
            }
        });
    }

    listarSolcMedic(){
        this.sevice.listarSolcMedic().subscribe(value => {
            if (value.body.success){
                this.solicitudesMedicion = value.body.elementos;
                this.parcelaElem = [];
                for (let element of value.body.elementos){
                    for (let parcela of element.parcelas){
                        this.parcelaElem.push(new ParcelaElement(parcela.id,parcela.consejoPopular.nombre,element.numExpediente,element.persona.ci,element.persona.nombre+' '+element.persona.primerApellido+' '+element.persona.segundoApellido,parcela.zonaCatastral,parcela.parcela+'/'+parcela.divicion,parcela.direccion, parcela.area))
                    }
                }
                this.dataSourceSolicMedCatas = new MatTableDataSource<ParcelaElement>(this.parcelaElem);
            }else {
                console.log(value.body.msg);
            }
        });
    }

    listarSolcEstudioSuelo(){
        this.sevice.listarSolcEstudioSuelo().subscribe(value => {
            if (value.body.success){
                this.lineaProducElement = [];
                this.solicitudesEstuSuelo = value.body.elementos;
                for (let element of value.body.elementos){
                    for (let lineaProduccion of element.lineasDeProduccion){
                        this.lineaProducElement.push(new LineaProducElement(element.numExpediente,lineaProduccion.id,lineaProduccion.lineaDeProduccion,lineaProduccion.areaDedicada,lineaProduccion.aprobado,lineaProduccion.estudioSuelo))
                    }
                }
                this.dataSourceSolicADLineasProduc = new MatTableDataSource<LineaProducElement>(this.lineaProducElement);
            }else {
                console.log(value.body.msg);
            }
        });
    }

    listarSolcRegulci(){
        this.sevice.listarSolcRegulci().subscribe(value => {
            if (value.body.success){
                this.solicitudesMedicRegul = value.body.elementos;
                this.formRegParcela.get('solicitud').setValue(this.solicitudesMedicRegul[0]);
            }else{
                console.log(value.body.msg);
            }
        });
    }

    listarSolcValoBienhechu(){
        this.sevice.listarSolcValoBienhechu().subscribe(value => {
            if (value.body.success){
                this.solicitudBienhech = value.body.elementos;
                this.formBienParcela.get('solicitud').setValue(this.solicitudBienhech[0]);
            }else{
                console.log(value.body.msg);
            }
        });
    }

    abrirVentanaBienhechuria() {
        let dialogRef = this.dialog.open(BienhechuriaWindowComponent, {
            width: '400px', disableClose: true, data: new Bienhechuria(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {width: '400px', data: {mensaje: 'Se ha insertado la bienhechuría: ' + result.elemento.nombre}});
                this.listarBienhechuria();
            }
        });
    }

    listarBienhechuria(){
        this.bienhechuriaService.listarAllBienhechuria().subscribe(value => {
            if (value.body.success){
                this.bienhechurias = value.body.elementos;
            }else {
                console.log(value.body.msg);
            }
        });
    }

    selecRegulacion (event:Event, element:RegulacionesElement){
        event.stopPropagation();
        if (element.activa==''){
            element.activa = 'active'
        }else{
            element.activa = '';
        }
        console.log(this.regulacionesAsigParcela);
    }

    asignaRegulaciones(event:Event){
        event.stopPropagation();
        for (let elemen of this.regulacionesElemen){
            if (elemen.activa=='active'){
                if (!(this.regulacionesAsigParcela.some(value => value.id === elemen.id))){
                    this.regulacionesAsigParcela.push(new RegulacionesElement(elemen.id,elemen.regulacion,''));
                    this.parcelaReg.regulaciones.push(new Regulacion(elemen.id,elemen.regulacion));
                    elemen.activa='';

                }else {
                    this.dialog.open(MensajeError, {
                        width: '400px',
                        data: {mensaje: 'La regulación ya se encuentra en la lista:'}
                    })
                    elemen.activa='';
                }
            }
        }
    }

    eliminaRegulaciones(event:Event){
        event.stopPropagation();
        for (let elemenP of this.regulacionesAsigParcela){
            if (elemenP.activa=='active'){
                let i = this.regulacionesAsigParcela.findIndex(x => x.id === elemenP.id);
                this.regulacionesAsigParcela.splice(i,1);
                i = this.parcelaReg.regulaciones.findIndex(x => x.id === elemenP.id);
                this.parcelaReg.regulaciones.splice(i,1);
            }
        }
    }

    asignarBienhechuria(){
        const bienhechuria  = this.formParcelaBienhechu.get('bienhechuria').value;

        if (this.editarBien == false){
            if (this.formParcelaBienhechu.valid){
                if (!(this.parcelaBien.parcelaBienhechurias.some(value => value.bienhechuria.id === bienhechuria.id))) {
                    this.parcelaBien.parcelaBienhechurias.push(this.formParcelaBienhechu.value);
                } else {
                    this.dialog.open(MensajeError, {
                        width: '400px',
                        data: {mensaje: 'La bienhechuría ya se encuentra en la lista:'}
                    })
                }
            }
        }else {
            for (let element of this.parcelaBien.parcelaBienhechurias){
                console.log('entro for');
                if (element.bienhechuria.id === this.idBienhech){
                    console.log('entro if');
                    element.bienhechuria = this.formParcelaBienhechu.get('bienhechuria').value;
                    element.cantidad = this.formParcelaBienhechu.get('cantidad').value;
                    element.precio = this.formParcelaBienhechu.get('precio').value;
                }
            }
            this.editarBien = false;
        }
        this.dataSourceParcelaBienhechu=new MatTableDataSource<ParcelaBienhechuria>(this.parcelaBien.parcelaBienhechurias);

        console.log(this.parcelaBien.parcelaBienhechurias);
    }

    editarBienhechuria(event:Event, element:ParcelaBienhechuria){
        event.stopPropagation();
        this.formParcelaBienhechu.patchValue(element);
        this.idBienhech = element.bienhechuria.id;
        this.editarBien=true;
    }

    abrirVentPersoDetalles(event:Event, element:Persona){
        event.stopPropagation();
        let dialogRef = this.dialog.open(PersonaDetallesComponent, {
            width: '1400px', disableClose: true, data: element,
        });

        dialogRef.afterClosed().subscribe(resul => {
            if (resul!=false){
                console.log(resul);
                this.sevice.listarSolicitudInvest().subscribe(value => {
                    console.log(value);
                    if (value.body.success){
                        this.solicitudInvest = value.body.elementos;
                        console.log(this.solicitudInvest);
                        this.dataSourceSolicInvest = new MatTableDataSource<Solicitud>(this.solicitudInvest);
                    }else {
                        console.log(value.body.msg);
                    }
                });
            }
        });
    }

    abrirVentActParcela(event:Event, idPar:number, numExp:number) {
        event.stopPropagation();
        var solicitud = this.solicitudesMedicRegul[this.solicitudesMedicRegul.findIndex(x => x.numExpediente === numExp)];
        var parcela:Parcela = solicitud.parcelas[solicitud.parcelas.findIndex(x => x.id === idPar)];

        console.log(parcela);
        let editDialogRef = this.dialog.open(ActuParcelaWindowComponent, {
            width: '1400px', disableClose: true, data: {parcela, numExp}
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado los datos de la parcela - '+result.elemento.parcela+'/'+result.elemento.divicion+' por certifico de catastro.'}
                });

                this.listarSolcMedic();
            }
        });
    }

    guardParceRegulAsig(event:Event){
        event.stopPropagation();
        this.sevice.guardarReguAsign(this.solicitudesMedicRegul).subscribe(value => {
            if (value.body.success){
                this.listarSolcRegulci();
            }
        })
    }

    guardParceBienhechuAsig(event:Event){
        event.stopPropagation();
        console.log(this.solicitudBienhech);
        this.sevice.guardarBienhechuAsign(this.solicitudBienhech).subscribe(value => {
            if (value.body.success){
                this.listarSolcValoBienhechu();
            }
        })
    }

    abrirVentAproDenegLP(event:Event, idLP:number, numExp:number){
        event.stopPropagation();
        var solicitud = this.solicitudesEstuSuelo[this.solicitudesEstuSuelo.findIndex(x => x.numExpediente === numExp)];
        var lineaDeProduccion:LineaDeProduccion = solicitud.lineasDeProduccion[solicitud.lineasDeProduccion.findIndex(x => x.id === idLP)];

        console.log(lineaDeProduccion)

        let editDialogRef = this.dialog.open(AprobarDenegarLPWindowComponent, {
            width: '1400px', disableClose: true, data: {lineaDeProduccion, numExp}
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                let aprobada = result.elemento.aprobado? 'Aprobado':'Denegado';
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha '+aprobada+' la línea de producción - '+result.elemento.lineaDeProduccion}
                });
                this.listarSolcEstudioSuelo();
            }
        });
    }

    abrirVentAproDeneSolicitud(event:Event, solicitud:Solicitud){
        event.stopPropagation();

        let editDialogRef = this.dialog.open(AprobarDenegarSolicitudWindowsComponent, {
            width: '1400px', disableClose: true, data: solicitud
        });

        editDialogRef.afterClosed().subscribe(result => {
            var aprobada = '';
            if (result != false && result.success) {
                if ((result.elemento.aprobadoCAgraria == 'Aprobada'&& result.elemento.aprobadoPCC =='') || (result.elemento.aprobadoCAgraria == '' && result.elemento.aprobadoPCC =='Aprobada')){
                    aprobada = 'Aprobado'
                } else {
                    aprobada = 'Denegado'
                }
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha'+aprobada+' la solicitud - '+result.elemento.numExpediente}
                });
            }
        });
    }



    geneReportAsigFecha(event:Event):void{
        event.stopPropagation();
        switch(this.tabGroup.selectedIndex) {
            case 0: {
                this.report.listarReporte('pdf').subscribe(value => {
                    console.log(value.body);
                });
                this.sevice.isertarIniciTramit(0, this.solicitudInvest).subscribe(value => {
                    if (value.body.success){

                       this.listarSolicitudInvest();
                    }
                });
                break;
            }
            case 1: {
                this.sevice.isertarIniciTramit(1, this.solicitudesMedicion).subscribe(value => {
                    if (value.body.success){
                        this.listarSolicitudInvest();
                        this.listarSolcMedic();
                        this.listarSolcRegulci();
                    }
                });
                break;
            }
            case 3: {
                this.sevice.isertarIniciTramit(3, this.solicitudesEstuSuelo).subscribe(value => {
                    if (value.body.success){
                        this.listarSolcMedic();
                        this.listarSolcRegulci();
                        this.listarSolcEstudioSuelo();
                    }
                });
                break;
            }
            case 4: {
                this.sevice.isertarIniciTramit(4, this.solicitudBienhech).subscribe(value => {
                    if (value.body.success){
                        this.listarSolcMedic();
                        this.listarSolcRegulci();
                        this.listarSolcEstudioSuelo();
                        this.listarSolcValoBienhechu();
                    }
                });
                break;
            }
            default: {
                break;
            }
        }
    }
}
