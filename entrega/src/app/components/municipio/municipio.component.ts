import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MunicipioService} from "../../Servicios/municipio.service";
import {Municipio} from "../../modelo";

import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {Confirm, Information} from "../../mensaje/window.mensaje";
import {SelectionModel} from "@angular/cdk/collections";
import {merge} from "rxjs/index";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MunicipioWindowComponent} from "./municipio-window/municipio-window.component";

@Component({
    selector: 'app-Municipio',
    templateUrl: './Municipio.component.html',
    styleUrls: ['./Municipio.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],

})
export class MunicipioComponent implements OnInit {

    dataSource: MatTableDataSource<Municipio> = new MatTableDataSource<Municipio>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['codigo', 'nombre', 'acciones'];
    selection = new SelectionModel<Municipio>(true, []);
    url: string = '';
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    expandedElement: Municipio;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Municipio>;

    constructor(private servicio: MunicipioService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'id';
        this.sort.direction = "desc";
        this.paginator.pageSize = this.pageSize;
        this.inicializarElementos();
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.servicio.listarMunicipio(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
                }),
                map(data => {
                    this.total = data.body.total;
                    this.isLoadingResults = false;
                    return data.body.elementos;
                }),
                catchError(data => {
                    return [];
                })
            )
            .subscribe(datos => {
                this.dataSource = new MatTableDataSource(datos);
                this.paginator.length = this.total;
                this.table.dataSource = this.dataSource;
                this.table.renderRows();
            });
    };


    abrirVentana() {
        let dialogRef = this.dialog.open(MunicipioWindowComponent, {
            width: '400px', disableClose: true, data: new Municipio(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                console.log(result);
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha insertardo la Municipio:' + result.elemento.nombre}
                });
                this.paginator.page.emit();
            }
        });
    }

    editarMunicipio(event: Event, Municipio: Municipio): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(MunicipioWindowComponent, {
            width: '400px', data: Municipio, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado la Municipio.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarMunicipio(event: Event, Municipio: Municipio): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la Municipio:<br>- ' + Municipio.nombre},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.servicio.eliminarMunicipio(Municipio.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '400px',
                            data: {mensaje: 'Se ha eliminado el hotel.'}
                        });
                        this.selection.clear();
                        this.paginator.page.emit();
                    }
                });
            }
        });
    }

    private inicializarElementos(): void {
        this.paginator._intl.itemsPerPageLabel = "Registros por página";
        this.paginator._intl.firstPageLabel = "Primera página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.paginator._intl.nextPageLabel = "Página siguiente";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length == 0 || pageSize == 0) {
                return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} de ${length}`;
        }
    }
}

