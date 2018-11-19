import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {Municipio, Provincia} from "../../../modelo";
import {MunicipioService} from "../../../servicios/municipio.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MensajeError} from "../../../mensaje/window.mensaje";
import {ProvinciaService} from "../../../servicios/provincia.service";
import {takeUntil} from "rxjs/internal/operators";
import {ReplaySubject} from "rxjs/index";


@Component({
    selector: 'app-municipio-window',
    templateUrl: './municipio-window.component.html',
    styleUrls: ['./municipio-window.component.css']
})
export class MunicipioWindowComponent implements OnInit {

    isLoadingResults = false;
    idMunicipio: number;
    form: FormGroup;
    insertar = false;
    municipio: Municipio;
    provincias: Provincia[] = [];
    public provinciasFiltradas: ReplaySubject<Provincia[]> = new ReplaySubject<Provincia[]>(1);

    constructor(public dialogRef: MatDialogRef<MunicipioWindowComponent>, @Inject(MAT_DIALOG_DATA) {id, codigo, nombre, provincia}: Municipio,
                private service: MunicipioService, private dialog: MatDialog, private provinciaService: ProvinciaService) {
        this.insertar = id == null;
        this.idMunicipio = id;
        this.form = new FormGroup({
            codigo: new FormControl(codigo, [Validators.required, Validators.maxLength(2)]),
            nombre: new FormControl(nombre, [Validators.required]),
            provincia: new FormControl(provincia, [Validators.required]),
        });
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    ngOnInit() {
        this.provinciaService.listarTodasProvincia().subscribe(resp => {
            if (resp.body.success) {
                this.provincias = resp.body.elementos;
                this.provinciasFiltradas.next(this.provincias);
            }
        });
    }

    insertarMunicipio(): void {
        if (this.form.valid) {
            this.isLoadingResults = true;
            if (this.insertar) {
                this.service.insertarMunicipio(this.form.value).subscribe(resp => {
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
                this.service.modificarMunicipio(this.idMunicipio, this.form.value).subscribe(resp => {
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

    compararProvincias(inicio: Provincia, fin: Provincia) {
        return inicio && fin && inicio.id === fin.id;
    }
}
