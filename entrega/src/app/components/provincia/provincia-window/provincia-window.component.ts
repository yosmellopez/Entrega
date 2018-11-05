import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Provincia} from "../../../modelo";
import {ProvinciaService} from "../../../Servicios/provincia.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";


@Component({
  selector: 'app-provincia-window',
  templateUrl: './provincia-window.component.html',
  styleUrls: ['./provincia-window.component.css']
})
export class ProvinciaWindowComponent implements OnInit {

  isLoadingResults = false;
  idProvincia:number;
  form: FormGroup;
  insertar = false;
  provincia:Provincia;

  constructor(public dialogRef: MatDialogRef<ProvinciaWindowComponent> , @Inject(MAT_DIALOG_DATA) {id, codigo, nombre}: Provincia,
              private service: ProvinciaService, private dialog: MatDialog) {
    this.insertar = id === null;
    this.idProvincia = id;
    this.form  = new FormGroup({
      codigo: new FormControl(codigo, [Validators.required]),
      nombre: new FormControl(nombre, [Validators.required]),

    });

  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
  }

  insertarProvincia(): void {
    console.log(this.form.value);
    if (this.form.valid) {
      this.isLoadingResults = true;
      if (this.insertar) {
        this.service.insertarProvincia(this.form.value).subscribe(resp => {
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
        this.service.modificarProvincia(this.idProvincia, this.form.value).subscribe(resp => {
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

}
