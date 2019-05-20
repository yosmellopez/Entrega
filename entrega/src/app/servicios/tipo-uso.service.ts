import { Injectable } from '@angular/core';
import {AppResponse, ConsejoPopular, Respuesta, TipoUso} from "../modelo";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {SERVER_URL} from "../contantes";

@Injectable({
  providedIn: 'root'
})
export class TipoUsoService {

    private token: string = "";
    private tipoUsoUrl = SERVER_URL + "api/tipoUso";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarTipoUso(sort: string, order: string, page: number, limit: number): Observable<Respuesta<TipoUso>> {
        let constUrl = `${this.tipoUsoUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        console.log(constUrl);
        return this.http.get<AppResponse<TipoUso>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarTodasTipoUso(): Observable<Respuesta<TipoUso>> {
        let constUrl = `${this.tipoUsoUrl}/todas`;
        return this.http.get<AppResponse<TipoUso>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarTipoUsoPorNombre(nombre:string): Observable<Respuesta<TipoUso>> {
        let constUrl = `${this.tipoUsoUrl+'/porNombre/'}${nombre}`;
        return this.http.get<AppResponse<TipoUso>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarTipoUso(tipoUso: TipoUso): Observable<Respuesta<TipoUso>> {
        return this.http.post<AppResponse<TipoUso>>(this.tipoUsoUrl + "/nuevo", tipoUso, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarTipoUso(id: number, tipoUso: TipoUso): Observable<Respuesta<TipoUso>> {
        tipoUso.id = id;
        return this.http.put<AppResponse<TipoUso>>(this.tipoUsoUrl+"/mod/" + id, tipoUso, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarTipoUso(id: number): Observable<Respuesta<TipoUso>> {
        return this.http.delete<AppResponse<TipoUso>>(this.tipoUsoUrl+"/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
