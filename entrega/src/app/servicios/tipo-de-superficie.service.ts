import { Injectable } from '@angular/core';
import {SERVER_URL} from "../contantes";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {AppResponse, Respuesta, TipoDeSuperficie} from "../modelo";

@Injectable({
  providedIn: 'root'
})
export class TipoDeSuperficieService {

    private token: string = "";
    private tipoDeSuperficieUrl = SERVER_URL + "api/tipoDeSuperficie";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarTipoDeSuperficie(sort: string, order: string, page: number, limit: number): Observable<Respuesta<TipoDeSuperficie>> {
        let constUrl = `${this.tipoDeSuperficieUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<TipoDeSuperficie>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarTodasTipoDeSuperficie(): Observable<Respuesta<TipoDeSuperficie>> {
        let constUrl = `${this.tipoDeSuperficieUrl}/todas`;
        return this.http.get<AppResponse<TipoDeSuperficie>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarTipoDeSuperficie(tipoDeSuperficie: TipoDeSuperficie): Observable<Respuesta<TipoDeSuperficie>> {
        return this.http.post<AppResponse<TipoDeSuperficie>>(this.tipoDeSuperficieUrl + "/nueva", tipoDeSuperficie, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarTipoDeSuperficie(id: number, tipoDeSuperficie: TipoDeSuperficie): Observable<Respuesta<TipoDeSuperficie>> {
        tipoDeSuperficie.id = id;
        return this.http.put<AppResponse<TipoDeSuperficie>>(this.tipoDeSuperficieUrl+"/mod/" + id, tipoDeSuperficie, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarTipoDeSuperficie(id: number): Observable<Respuesta<TipoDeSuperficie>> {
        return this.http.delete<AppResponse<TipoDeSuperficie>>(this.tipoDeSuperficieUrl+"/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
