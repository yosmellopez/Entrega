import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {AppResponse, Persona, Provincia, Respuesta} from "../modelo";
import {SERVER_URL} from "../contantes";

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

    private token: string = "";
    private personaUrl = SERVER_URL + "api/persona";

    constructor(private http:HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarPersona(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Persona>> {
        let constUrl = `${this.personaUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Persona>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarPorTipoPersona(tipoPersona:string): Observable<Respuesta<Persona>> {
        let constUrl = `${this.personaUrl+'/'}${tipoPersona}`;
        return this.http.get<AppResponse<Persona>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    obtenerPorCI(ci:string): Observable<Respuesta<Persona>> {
        let constUrl = `${this.personaUrl+'/ci/'}${ci}`;
        return this.http.get<AppResponse<Persona>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarPersona(persona: Persona): Observable<Respuesta<Persona>> {
        return this.http.post<AppResponse<Persona>>(this.personaUrl, persona, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarlistPersona(personas: Persona[]): Observable<Respuesta<Persona>> {
        return this.http.post<AppResponse<Persona>>(this.personaUrl+'/insrtList', personas, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarPersona(id: number, persona: Persona): Observable<Respuesta<Persona>> {
        persona.id = id;
        return this.http.put<AppResponse<Persona>>(`${this.personaUrl}/${id}`, persona, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarPersona(id: number): Observable<Respuesta<Persona>> {
        return this.http.delete<AppResponse<Persona>>(`${this.personaUrl}/${id}`, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }


}
