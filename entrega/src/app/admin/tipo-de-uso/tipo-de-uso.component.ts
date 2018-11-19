import {Component, OnInit, ViewChild} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SelectionModel} from "@angular/cdk/collections";
import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";
import {TipoDeUso} from "../../modelo";
import {catchError, map, startWith, switchMap} from "rxjs/internal/operators";
import {merge} from "rxjs/index";
import {Confirm, Information} from "../../mensaje/window.mensaje";
import {TipoDeUsoService} from "../../servicios/tipo-de-uso.service";
import {TipoDeUsoWindowComponent} from "./tipo-de-uso-window/tipo-de-uso-window.component";

@Component({
  selector: 'app-tipo-de-uso',
  templateUrl: './tipo-de-uso.component.html',
  styleUrls: ['./tipo-de-uso.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class TipoDeUsoComponent implements OnInit {

    dataSource: MatTableDataSource<TipoDeUso> = new MatTableDataSource<TipoDeUso>();
    total: number = 0;
    pageSize: number = 10;
    displayedColumns = ['codigo', 'nombre','tipoDeSuperficie', 'acciones'];
    selection = new SelectionModel<TipoDeUso>(true, []);
    url: string = '';
    nombre: string = '';
    resultsLength = 0;
    isLoadingResults = true;
    isRateLimitReached = false;
    expandedElement: TipoDeUso;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<TipoDeUso>;

  constructor(private servicio:TipoDeUsoService, private dialog:MatDialog) { }

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
                  return this.servicio.listarTipoDeUso(this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
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

    abrirVentana() {
        let dialogRef = this.dialog.open(TipoDeUsoWindowComponent, {
            width: '400px', disableClose: true, data: new TipoDeUso(),
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                console.log(result);
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha insertardo el tipo de Uso:' + result.elemento.nombre}
                });
                this.paginator.page.emit();
            }
        });
    }

    editarTipoDeUso(event: Event, tipoDeUso: TipoDeUso): void {
        event.stopPropagation();
        let editDialogRef = this.dialog.open(TipoDeUsoWindowComponent, {
            width: '400px', data: tipoDeUso, disableClose: true
        });

        editDialogRef.afterClosed().subscribe(result => {
            if (result != false && result.success) {
                this.dialog.open(Information, {
                    width: '400px',
                    data: {mensaje: 'Se ha modificado el tipo de Uso.'}
                });
                this.paginator.page.emit();
            }
        });
    }

    eliminarTipoDeUso(event: Event, tipoDeUso: TipoDeUso): void {
        event.stopPropagation();
        let dialogRef = this.dialog.open(Confirm, {
            width: '400px',
            data: {mensaje: 'Desea eliminar la provincia:<br>- ' + tipoDeUso.nombre},
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.servicio.eliminarTipoDeUso(tipoDeUso.id).subscribe(resp => {
                    if (resp.body.success) {
                        this.dialog.open(Information, {
                            width: '400px',
                            data: {mensaje: 'Se ha eliminado el tipo de Uso.'}
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
