import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { catchError, map, startWith, switchMap } from 'rxjs/internal/operators';
import { merge } from 'rxjs/index';
import { MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { Municipio, Parcela, Solicitud } from '../../modelo';
import { SolicitudService } from '../../servicios/solicitud.service';
import { Information } from '../../mensaje/window.mensaje';
import { MunicipioWindowComponent } from '../municipio/municipio-window/municipio-window.component';
import { DetallesSolicitudComponent } from './detalles-solicitud/detalles-solicitud.component';
import { BlockScrollStrategy } from '@angular/cdk/overlay';
import { SolicitudWindowComponent } from './solicitud-window/solicitud-window.component';


@Component({
    selector: 'app-solicitud',
    templateUrl: './solicitud.component.html',
    styleUrls: ['./solicitud.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})


export class SolicitudComponent implements OnInit {
    dataSource: MatTableDataSource<Solicitud> = new MatTableDataSource<Solicitud>();
    parcelas: Parcela[] = [];
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['index', 'numExpediente', 'fechaSolicitud', 'areaSolicitada', 'estado', 'acciones'];
    selection = new SelectionModel<Solicitud>(false, []);
    url: string = '';
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Solicitud>;

    constructor(private servicio: SolicitudService, private dialog: MatDialog) {
    }

    ngOnInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.active = 'id';
        this.sort.direction = 'desc';
        this.paginator.pageSize = this.pageSize;
        this.inicializarElementos();
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.servicio.listarSolicitud('Expediente', this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
    }

    abrirVentanaDetalles(event: Event, solicitud: Solicitud): void {
        event.stopPropagation();

        let dialogRef = this.dialog.open(DetallesSolicitudComponent, {
            width: '1400px', disableClose: true, data: solicitud,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.paginator.page.emit();
            }
        });
    }

    abrirVentana() {
        let dialogRef = this.dialog.open(SolicitudWindowComponent, {
            width: '900px', disableClose: true, data: new Solicitud(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha insertardo la solicitud:' + result.elemento.numExpediente}
                });
                this.paginator.page.emit();
            }
        });
    }

    editarSolicitud(event: Event, solicitud: Solicitud): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(SolicitudWindowComponent, {
            width: '900px', data: solicitud, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado la solicitud.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    /* eliminarTipoSuperficie(event: Event, tipoDeSuperficie: TipoSuperficie): void {
         event.stopPropagation();
         let dialogRef = this.dialog.open(Confirm, {
             width: '400px',
             data: {mensaje: 'Desea eliminar la provincia:<br>- ' + tipoDeSuperficie.nombre},
         });
         dialogRef.afterClosed().subscribe(result => {
             if (result) {
                 this.servicio.eliminarTipoSuperficie(tipoDeSuperficie.id).subscribe(resp => {
                     if (resp.body.success) {
                         this.dialog.open(Information, {
                             width: '400px',
                             data: {mensaje: 'Se ha eliminado el tipo de superficie.'}
                         });
                         this.selection.clear();
                         this.paginator.page.emit();
                     }
                 });
             }
         });
     }*/

    private inicializarElementos(): void {
        this.paginator._intl.itemsPerPageLabel = 'Registros por página';
        this.paginator._intl.firstPageLabel = 'Primera página';
        this.paginator._intl.lastPageLabel = 'Última página';
        this.paginator._intl.nextPageLabel = 'Página siguiente';
        this.paginator._intl.previousPageLabel = 'Página anterior';
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
