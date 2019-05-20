import { Injectable } from '@angular/core';
import {SERVER_URL} from "../contantes";
import {HttpClient} from "@angular/common/http";
import {AppResponse, Respuesta, Solicitud, TipoUso} from "../modelo";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class TramiteService {

    private token: string = "";
    private tipoUsoUrl = SERVER_URL + "api/tramite";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarSolicitudInvest(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoUsoUrl}/investi`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
