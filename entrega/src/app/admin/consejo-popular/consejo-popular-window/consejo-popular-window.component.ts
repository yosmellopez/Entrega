import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject} from "rxjs/index";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {ConsejoPopular, Municipio, Provincia} from "../../../modelo";
import {MunicipioService} from "../../../servicios/municipio.service";
import {ConsejoPopularService} from "../../../servicios/consejo-popular.service";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {ProvinciaService} from "../../../Servicios/provincia.service";

@Component({
    selector: 'app-consejo-popular-window',
    templateUrl: './consejo-popular-window.component.html',
    styleUrls: ['./consejo-popular-window.component.css']
})
export class ConsejoPopularWindowComponent implements OnInit {

    isLoadingResults = false;
    idConsejoPopular: number;
    form: FormGroup;
    provinciaControl: FormControl = new FormControl();
    insertar = false;
    consejoPopular: ConsejoPopular;
    municipios: Municipio[] = [];
    provincias: Provincia[] = [];
    public municipiosFiltrados: Municipio[] = [];

    constructor(public dialogRef: MatDialogRef<ConsejoPopularWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, codigo, nombre, municipio}: ConsejoPopular,
                private service: ConsejoPopularService, private dialog: MatDialog, private municipioService: MunicipioService, private provinciaService: ProvinciaService) {
        this.insertar = id == null;
        this.idConsejoPopular = id;
        this.form = new FormGroup({
            codigo: new FormControl(codigo, [Validators.required, Validators.maxLength(2)]),
            nombre: new FormControl(nombre, [Validators.required]),
            municipio: new FormControl(municipio, [Validators.required]),
        });
        if (!this.insertar) {
            this.provinciaControl.setValue(municipio.provincia);
            this.form.controls['municipio'].patchValue(municipio);
        }
        this.provinciaControl.valueChanges.subscribe(this.filtrarMunicipios.bind(this));
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    ngOnInit() {
        this.municipioService.listarTodosMunicipio().subscribe(resp => {
            if (resp.body.success) {
                this.municipios = resp.body.elementos;
                this.municipiosFiltrados = resp.body.elementos;
                if (!this.insertar) {
                    this.municipiosFiltrados = this.municipios.filter(municipio => {
                        return municipio.provincia.id === this.provinciaControl.value.id;
                    });
                }
            }
        });
        this.provinciaService.listarTodasProvincia().subscribe(resp => {
            if (resp.body.success) {
                this.provincias = resp.body.elementos;
            }
        });
    }

    insertarConsejoPopular(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarConsejoPopular(this.form.value).subscribe(resp => {
                    let appResp = resp.body;
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

    compararProvincias(inicio: Provincia, fin: Provincia) {
        if (inicio && fin && inicio.id && fin.id)
            return inicio.id === fin.id;
        return false;
    }

    filtrarMunicipios(provincia: Provincia) {
        this.municipiosFiltrados = this.municipios.filter(municipio => {
            return municipio.provincia.id === provincia.id;
        });
        this.form.controls['municipio'].reset();
    }
}
