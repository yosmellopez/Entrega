import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from "@angular/material";
import {LineaDeProduccion, Parcela, Persona, Solicitud} from "../../../modelo";

@Component({
  selector: 'app-detalles-solicitud',
  templateUrl: './detalles-solicitud.component.html',
  styleUrls: ['./detalles-solicitud.component.css']
})
export class DetallesSolicitudComponent implements OnInit {

  displayedColumnsParcela = ['index','zonaCatastral','parcela','divicion','area','limiteN','limiteS','limiteE','limiteW','acciones'];
  displayedColumnsSolicitante:string[] = ['index','nombre','primerApellido','segundoApellido','sexo','dirParticular','movil','telFijo','acciones'];
  displayedColumnslineaDeProduc = ['index','lineaDeProduccion','areaDedicada','estudioSuelo','acciones'];
  solicitante: Persona[]=[];
  numeroExpediente:number;
  parcelas: Parcela[]=[];
  lineasDeProduccion: LineaDeProduccion[]=[];


  constructor(public dialogRef:MatDialogRef<DetallesSolicitudComponent>,@Inject(MAT_DIALOG_DATA){id,numExpediente,persona,parcelas,lineasDeProduccion}:Solicitud) {
      this.parcelas=parcelas;
      this.solicitante[0] = persona;
      this.lineasDeProduccion=lineasDeProduccion;
      this.numeroExpediente=numExpediente;
  }

  onNoClick(): void {
        this.dialogRef.close(false);
  }

  ngOnInit() {
      console.log(this.parcelas);
      console.log(this.solicitante);
      console.log(this.lineasDeProduccion);

  }

}
