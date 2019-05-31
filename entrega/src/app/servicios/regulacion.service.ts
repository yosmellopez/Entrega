import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {AppResponse, Bienhechuria, Regulacion, Respuesta} from "../modelo";
import {SERVER_URL} from "../contantes";

@Injectable({
  providedIn: 'root'
})
export class RegulacionService {

    private token: string = "";
    private regulacionUrl = SERVER_URL + "api/regulacion";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarRegulacion(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Regulacion>> {
        let constUrl = `${this.regulacionUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Regulacion>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarAllRegulacion(): Observable<Respuesta<Regulacion>> {
        let constUrl = `${this.regulacionUrl}/todas`;
        return this.http.get<AppResponse<Regulacion>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }


    insertarRegulacion(regulacion: Regulacion): Observable<Respuesta<Regulacion>> {
        return this.http.post<AppResponse<Regulacion>>(this.regulacionUrl, regulacion, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarRegulacion(id: number, regulacion: Regulacion): Observable<Respuesta<Regulacion>> {
        regulacion.id = id;
        return this.http.put<AppResponse<Regulacion>>(`${this.regulacionUrl}/${id}`, regulacion, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
