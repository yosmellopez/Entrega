import { Injectable } from '@angular/core';
import {SERVER_URL} from "../contantes";
import {HttpClient} from "@angular/common/http";
import {
    AppResponse,
    LineaDeProduccion,
    Parcela,
    PersonaParcelas,
    Regulacion,
    Respuesta,
    Solicitud,
    TipoUso
} from "../modelo";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class TramiteService {

    private token: string = "";
    private tipoTramiteUrl = SERVER_URL + "api/tramite";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarSolicitudInvest(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/investi`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarSolcMedic(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/medic`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarSolcRegulci(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/regulaci`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarSolcEstudioSuelo(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/estudioSuelo`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarSolcValoBienhechu(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/valoBienhechu`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarSolcAprobadoCAgraria(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/aprobadoCAgraria`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarSolcFechaAprobadoPCC(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/fechaAprobadoPCC`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarEstadoParc(element:PersonaParcelas): Observable<Respuesta<PersonaParcelas>> {
        let constUrl = `${this.tipoTramiteUrl}/modificarEstadoParc`;
        return this.http.put<AppResponse<PersonaParcelas>>(constUrl, element, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modifParcela(id:number,parcela:Parcela,numExp:number): Observable<Respuesta<Parcela>> {
        parcela.id = id;
        let constUrl = `${this.tipoTramiteUrl}/modificarParcela/${id}/${numExp}`;
        return this.http.put<AppResponse<Parcela>>(constUrl, parcela, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    guardarReguAsign(solicitudes: Solicitud[]): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/asignarRegulaParcela`;
        return this.http.put<AppResponse<Solicitud>>(constUrl, solicitudes, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    guardarBienhechuAsign(solicitudes: Solicitud[]): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.tipoTramiteUrl}/asignarBienhechuParcela`;
        return this.http.put<AppResponse<Solicitud>>(constUrl, solicitudes, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    aprobarDenegarLineaPro (id:number,lineaDeProduccion: LineaDeProduccion,numExp:number): Observable<Respuesta<LineaDeProduccion>> {
        let constUrl = `${this.tipoTramiteUrl}/aprobarDenegarLineaPro/${id}/${numExp}`;
        return this.http.put<AppResponse<LineaDeProduccion>>(constUrl, lineaDeProduccion, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    isertarIniciTramit(idMatTab:number,elementos:Solicitud[]): Observable<Respuesta<Solicitud>> {
        console.log(elementos)
        let constUrl = `${this.tipoTramiteUrl}/iniciTramit/${idMatTab}`;
        return this.http.put<AppResponse<Solicitud>>(constUrl, elementos, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

}
