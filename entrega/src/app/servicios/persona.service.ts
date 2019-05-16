import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs/index';
import { AppResponse, Integracion, Persona, Provincia, Respuesta, Rol } from '../modelo';
import { SERVER_URL } from '../contantes';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PersonaService {

    private token: string = '';
    private personaUrl = SERVER_URL + 'api/persona';
    private integracionUrl = SERVER_URL + 'api/integracion';
    private integraciones: Integracion[] = [];

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('user_token');
    }

    listarPersona(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Persona>> {
        let constUrl = `${this.personaUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Persona>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    listarPorTipoPersona(tipoPersona: string): Observable<Respuesta<Persona>> {
        let constUrl = `${this.personaUrl + '/'}${tipoPersona}`;
        return this.http.get<AppResponse<Persona>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    obtenerPorCI(ci: string): Observable<Respuesta<Persona>> {
        let constUrl = `${this.personaUrl + '/ci/'}${ci}`;
        return this.http.get<AppResponse<Persona>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    insertarPersona(persona: Persona): Observable<Respuesta<Persona>> {
        return this.http.post<AppResponse<Persona>>(this.personaUrl, persona, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    insertarlistPersona(personas: Persona[]): Observable<Respuesta<Persona>> {
        console.log(personas);
        return this.http.post<AppResponse<Persona>>(this.personaUrl + '/insrtList', personas, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    modificarPersona(id: number, persona: Persona): Observable<Respuesta<Persona>> {
        persona.id = id;
        return this.http.put<AppResponse<Persona>>(`${this.personaUrl}/${id}`, persona, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    listarIntegraciones(): Observable<Integracion[]> {
        if (this.integraciones.length === 0) {
            return this.http.get<AppResponse<Integracion>>(this.integracionUrl, {
                observe: 'response',
                headers: {'Authorization': this.token}
            }).pipe(mergeMap(resp => {
                if (resp.body.success) {
                    this.integraciones = resp.body.elementos;
                    return of(this.integraciones);
                } else {
                    return [];
                }
            }));
        } else {
            return of(this.integraciones);
        }
    }

    eliminarPersona(id: number): Observable<Respuesta<Persona>> {
        return this.http.delete<AppResponse<Persona>>(`${this.personaUrl}/${id}`, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }
}
