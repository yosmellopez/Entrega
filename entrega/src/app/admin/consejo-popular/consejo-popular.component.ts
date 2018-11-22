import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {MunicipioService} from "../../servicios/municipio.service";
import {ConsejoPopular, Municipio} from "../../modelo";
import {ConsejoPopularService} from "../../servicios/consejo-popular.service";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {merge} from "rxjs/index";
import {Confirm, Information} from "../../mensaje/window.mensaje";
import {MunicipioWindowComponent} from "../municipio/municipio-window/municipio-window.component";
import {ConsejoPopularWindowComponent} from "./consejo-popular-window/consejo-popular-window.component";

@Component({
  selector: 'app-consejo-popular',
  templateUrl: './consejo-popular.component.html',
  styleUrls: ['./consejo-popular.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class ConsejoPopularComponent implements OnInit {

    dataSource: MatTableDataSource<ConsejoPopular> = new MatTableDataSource<ConsejoPopular>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['codigo', 'nombre', 'municipio','provincia', 'acciones'];
    selection = new SelectionModel<ConsejoPopular>(true, []);
    url: string = '';
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    expandedElement: ConsejoPopular;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<ConsejoPopular>;

    constructor(private servicio: ConsejoPopularService, private dialog: MatDialog) {
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
                    return this.servicio.listarConsejoPopular(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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
        let dialogRef = this.dialog.open(ConsejoPopularWindowComponent, {
            width: '400px', disableClose: true, data: new ConsejoPopular(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                console.log(result);
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha insertardo el Consejo Popular: ' + result.elemento.nombre}
                });
                this.paginator.page.emit();
            }
        });
    }

    editarConsejoPopular(event: Event, consejoPopular: ConsejoPopular): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(ConsejoPopularWindowComponent, {
            width: '400px', data: consejoPopular, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado el consejo popular.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarConsejoPopular(event: Event, consejoPopular: ConsejoPopular): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar los Municipio:<br>- ' + consejoPopular.nombre},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.servicio.eliminarConsejoPopular(consejoPopular.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '400px',
                            data: {mensaje: 'Se ha eliminado el consejo popular.'}
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
