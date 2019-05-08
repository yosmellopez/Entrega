import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Persona} from "../../../modelo";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PersonaService} from "../../../servicios/persona.service";
import {ReplaySubject} from "rxjs/index";
import {MensajeError} from "../../../mensaje/window.mensaje";

@Component({
  selector: 'app-persona-windows',
  templateUrl: './persona-windows.component.html',
  styleUrls: ['./persona-windows.component.css']
})
export class PersonaWindowsComponent implements OnInit {

    isLoadingResults = false;
    form:FormGroup;
    idPersona:number;
    startDate = new Date(1988, 0, 1);
    insertar = false;
    personas:Persona[];
    selected: string;
   public PersonasFiltradas: ReplaySubject<Persona[]> = new ReplaySubject<Persona[]>(1);

  constructor(public dialogRef:MatDialogRef<PersonaWindowsComponent>,
              @Inject(MAT_DIALOG_DATA){id, tipoPersona, ci, nombre, primerApellido, segundoApellido, sexo = 'M', dirParticular, edad, movil, telFijo, situacionLaboral, asociado}:Persona,
              private formBuilder: FormBuilder, private service:PersonaService, private dialog:MatDialog) {
      this.insertar = id == null;
      this.idPersona = id;
      this.selected = tipoPersona;

      this.form = new FormGroup({
          tipoPersona: new FormControl(tipoPersona),
          ci: new FormControl(ci, [Validators.required, Validators.maxLength(11)]),
          nombre: new FormControl(nombre, [Validators.required]),
          primerApellido: new FormControl(primerApellido, [Validators.required]),
          segundoApellido: new FormControl(segundoApellido, [Validators.required]),
          sexo: new FormControl(sexo),
          dirParticular: new FormControl(dirParticular),
          edad: new FormControl(edad),
          movil: new FormControl(movil, [Validators.maxLength(8)]),
          telFijo: new FormControl(telFijo, [Validators.maxLength(8)]),
          situacionLaboral: new FormControl(situacionLaboral),
          asociado: new FormControl(asociado, [Validators.required])
      });
  }

  ngOnInit() {
      this.listarTipoPersonaJuridica()
      console.log(this.form.value);
  }

  selectTipoPersona(tipoPersona: string): void {
    console.log('Entro');
    if (tipoPersona == 'Juridica') {
        console.log('Entro');
        this.form.get('sexo').setValue('-');
        this.form.get('dirParticular').setValue(null);
        this.form.get('fechaNacimiento').setValue(null);
        this.form.get('movil').setValue(null);
        this.form.get('telFijo').setValue(null);
        this.form.get('situacionLaboral').setValue(null);
        this.form.get('tipoPersona').setValue(tipoPersona);
    } else {
        this.form.get('sexo').setValue('M');
        this.form.get('dirParticular').setValue(null);
        this.form.get('telFijo').setValue(null);
        this.form.get('tipoPersona').setValue(tipoPersona);
    }
  }

    listarTipoPersonaJuridica(){
        this.service.listarPorTipoPersona('Juridica').subscribe(resp =>{
            if (resp.body.success){
                this.personas = resp.body.elementos;
                this.PersonasFiltradas.next(this.personas);
            }
        });
    }

    compararPersonas(inicio: Persona, fin: Persona) {
        return inicio && fin && inicio.id === fin.id;
    }

    insertarPersona(): void {
        console.log(this.form.value);
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarPersona(this.form.value).subscribe(resp => {
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
                this.service.modificarPersona(this.idPersona, this.form.value).subscribe(resp => {
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
