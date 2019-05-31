import { Injectable } from '@angular/core';
import {AppResponse, Parcela, Respuesta} from "../modelo";
import {Observable} from "rxjs/index";
import {SERVER_URL} from "../contantes";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ParcelaService {

    private token: string = '';
    private ParcelaUrl = SERVER_URL + 'api/parcela';

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('user_token');
    }

    listarParcela(estado: string, sort: string, order: string, page: number, limit: number): Observable<Respuesta<Parcela>> {
        let constUrl = `${this.ParcelaUrl}/estado?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Parcela>>(constUrl, {
            observe: 'response',
            //params: {estado: estado},
            headers: {'Authorization': this.token}
        });
    }

    obtenerParcela (zc:number, parcela:number, divicion:number):Observable<Respuesta<Parcela>>{
        let constUrl = `${this.ParcelaUrl}/zc=${zc}&parcela:${parcela}&divicion:${divicion}`;
        return this.http.get<AppResponse<Parcela>>(constUrl, {
            observe: 'response',
            //params: {estado: estado},
            headers: {'Authorization': this.token}
        });
    }

    insertarParcela(parcela: Parcela): Observable<Respuesta<Parcela>> {
        console.log(parcela);
        return this.http.post<AppResponse<Parcela>>(this.ParcelaUrl, parcela, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    modificarParcela(id: number, parcela: Parcela): Observable<Respuesta<Parcela>> {
        parcela.id = id;
        return this.http.put<AppResponse<Parcela>>(`${this.ParcelaUrl}/${id}`, parcela, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    eliminarParcela(id: number): Observable<Respuesta<Parcela>> {
        return this.http.delete<AppResponse<Parcela>>(`${this.ParcelaUrl}/${id}`, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }
}
