import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject} from "rxjs/index";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConsejoPopular, Municipio, Provincia} from "../../../modelo";
import {MunicipioService} from "../../../servicios/municipio.service";
import {ConsejoPopularService} from "../../../servicios/consejo-popular.service";
import {MensajeError} from "../../../mensaje/window.mensaje";

@Component({
  selector: 'app-consejo-popular-window',
  templateUrl: './consejo-popular-window.component.html',
  styleUrls: ['./consejo-popular-window.component.css']
})
export class ConsejoPopularWindowComponent implements OnInit {

    isLoadingResults = false;
    idConsejoPopular: number;
    form: FormGroup;
    insertar = false;
    consejoPopular: ConsejoPopular;
    municipios: Municipio[] = [];
    public municipiosFiltrados: ReplaySubject<Municipio[]> = new ReplaySubject<Municipio[]>(1);

    constructor(public dialogRef: MatDialogRef<ConsejoPopularWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, codigo, nombre, municipio}: ConsejoPopular,
                private service: ConsejoPopularService, private dialog: MatDialog, private municipioService: MunicipioService) {
        this.insertar = id == null;
        this.idConsejoPopular = id;
        this.form = new FormGroup({
            codigo: new FormControl(codigo, [Validators.required, Validators.maxLength(2)]),
            nombre: new FormControl(nombre, [Validators.required]),
            municipio: new FormControl(municipio, [Validators.required]),
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    ngOnInit() {
        this.municipioService.listarTodosMunicipio().subscribe(resp => {
            console.log(resp);
            if (resp.body.success) {
                this.municipios = resp.body.elementos;
                this.municipiosFiltrados.next(this.municipios);
            }
        });
    }

    insertarConsejoPopular(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarConsejoPopular(this.form.value).subscribe(resp => {
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
                this.service.modificarConsejoPopular(this.idConsejoPopular, this.form.value).subscribe(resp => {
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

    compararMunicipios(inicio: Municipio, fin: Municipio) {
        return inicio && fin && inicio.id === fin.id;
    }

}
