import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from "@angular/material";
import {Persona, PersonaAyuda, PersonaParcelas, Solicitud} from "../../../modelo";
import {SolicitudService} from "../../../servicios/solicitud.service";
import {DetallesSolicitudComponent} from "../../solicitud/detalles-solicitud/detalles-solicitud.component";
import {Information} from "../../../mensaje/window.mensaje";
import {BienhechuriaWindowComponent} from "../../../registrador/bienhechurias/bienhechuria-window/bienhechuria-window.component";
import {EstadoParcelaWindowComponent} from "../../../registrador/tramite/estado-parcela-window/estado-parcela-window.component";


@Component({
  selector: 'app-persona-detalles',
  templateUrl: './persona-detalles.component.html',
  styleUrls: ['./persona-detalles.component.css']
})
export class PersonaDetallesComponent implements OnInit {

    persona:Persona = new Persona();
    stadoPersona: string = 'persona'

    displayColumnsSolicitud = ['index','numExpediente', 'tipoSolicitud','areaSolicitada','estado','aprobadoCAgraria','aprobadoPCC','acciones'];
    displayColumnsParcela = ['index','zonaCatastral','parcela','direccion','fechaAlta','tipoDeTenencia','areaVacia','acciones'];
    displayColumnsPersonaAyuda = ['index','ci','nombre_y_apellido','parentesco','acciones'];

    dataSourceSolic = new MatTableDataSource<Solicitud>();
    dataSourceParcela = new MatTableDataSource<PersonaParcelas>();
    dataSourcePersonaAyuda = new MatTableDataSource<PersonaAyuda>();


    constructor(public dialogRef: MatDialogRef<PersonaDetallesComponent>, @Inject(MAT_DIALOG_DATA){id, tipoPersona, ci, nombre, primerApellido, segundoApellido, personaParcelas, personasAyuda}: Persona, private service: SolicitudService, private dialog:MatDialog) {
      this.persona.id = id;
      this.persona.tipoPersona = tipoPersona;
      this.persona.ci = ci;
      this.persona.nombre = nombre;
      this.persona.primerApellido = primerApellido;
      this.persona.segundoApellido = segundoApellido;
      this.persona.personaParcelas = personaParcelas;
      this.persona.personasAyuda = personasAyuda;
      console.log(personaParcelas);
    }

    ngOnInit() {
        this.service.listarAllSolicitudPerso(this.persona.id).subscribe(value => {
            if (value.body.success){
                this.dataSourceSolic = new MatTableDataSource<Solicitud>(value.body.elementos);
            }
            if (value.body.total = 0){
                this.stadoPersona = 'de la persona';
            } else if (this.persona.personaParcelas == null){
                this.stadoPersona = 'del solicitante';
            } else {
                this.stadoPersona = 'del poseedor'
            }
        });
        this.dataSourceParcela = new MatTableDataSource<PersonaParcelas>(this.persona.personaParcelas);
        this.dataSourcePersonaAyuda = new MatTableDataSource<PersonaAyuda>(this.persona.personasAyuda);
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    abrirVentanaDetallSolic(event: Event, solicitud: Solicitud): void {
        event.stopPropagation();

        let dialogRef = this.dialog.open(DetallesSolicitudComponent, {
            width: '1400px', disableClose: true, data: solicitud,
        });
    }

    abrirEstadoParcela(event: Event, personaParcela: PersonaParcelas){
        event.stopPropagation();
        let editDialogRef = this.dialog.open(EstadoParcelaWindowComponent, {
            width: '400px', data: personaParcela, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado el estado de la parcela.'}
                });
                this.dataSourcePersonaAyuda = new MatTableDataSource<PersonaAyuda>(result.elemento);
            }
        });
    }
}
