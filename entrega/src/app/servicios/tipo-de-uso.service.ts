import { Injectable } from '@angular/core';
import {AppResponse, Respuesta, TipoDeUso} from "../modelo";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {SERVER_URL} from "../contantes";

@Injectable({
  providedIn: 'root'
})
export class TipoDeUsoService {

    private token: string = "";
    private tipoDeUsoUrl = SERVER_URL + "api/tipoDeUso";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarTipoDeUso(sort: string, order: string, page: number, limit: number): Observable<Respuesta<TipoDeUso>> {
        let constUrl = `${this.tipoDeUsoUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        console.log(constUrl);
        return this.http.get<AppResponse<TipoDeUso>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarTodasTipoDeUso(): Observable<Respuesta<TipoDeUso>> {
        let constUrl = `${this.tipoDeUsoUrl}/todas`;
        return this.http.get<AppResponse<TipoDeUso>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarTipoDeUso(tipoDeUso: TipoDeUso): Observable<Respuesta<TipoDeUso>> {
        return this.http.post<AppResponse<TipoDeUso>>(this.tipoDeUsoUrl + "/nuevo", tipoDeUso, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarTipoDeUso(id: number, tipoDeUso: TipoDeUso): Observable<Respuesta<TipoDeUso>> {
        tipoDeUso.id = id;
        return this.http.put<AppResponse<TipoDeUso>>(this.tipoDeUsoUrl+"/mod/" + id, tipoDeUso, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarTipoDeUso(id: number): Observable<Respuesta<TipoDeUso>> {
        return this.http.delete<AppResponse<TipoDeUso>>(this.tipoDeUsoUrl+"/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
