import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Information} from "../../mensaje/window.mensaje";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {SelectionModel} from "@angular/cdk/collections";
import {Regulacion} from "../../modelo";
import {RegulacionService} from "../../servicios/regulacion.service";
import {merge} from "rxjs/index";
import {RegulacionWindowComponent} from "./regulacion-window/regulacion-window.component";
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-regulacion',
    templateUrl: './regulacion.component.html',
    styleUrls: ['./regulacion.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class RegulacionComponent implements OnInit {

    dataSource: MatTableDataSource<Regulacion> = new MatTableDataSource<Regulacion>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['index', 'regulacion', 'acciones'];
    selection = new SelectionModel<Regulacion>(true, []);
    url: string = '';
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    expandedElement: Regulacion;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Regulacion>;

    constructor(private servicio: RegulacionService, private dialog: MatDialog) {
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
                    return this.servicio.listarRegulacion(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
        let dialogRef = this.dialog.open(RegulacionWindowComponent, {
            width: '400px', disableClose: true, data: new Regulacion(null, ''),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                console.log(result);
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha insertardo la Regulación'}
                });
                this.paginator.page.emit();
            }
        });
    }

    editarRegulacion(event: Event, regulacion: Regulacion): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(RegulacionWindowComponent, {
            width: '400px', data: regulacion, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado la Regulación.'}
                });
                this.paginator.page.emit();
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
