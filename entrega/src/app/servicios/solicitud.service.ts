import {Injectable} from '@angular/core';
import {AppResponse, ConsejoPopular, Provincia, Respuesta, Solicitud} from '../modelo';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {SERVER_URL} from '../contantes';

@Injectable({
    providedIn: 'root'
})
export class SolicitudService {

    private token: string = '';
    private solicitudUrl = SERVER_URL + 'api/solicitud';

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('user_token');
    }

    listarSolicitud(estado: string, sort: string, order: string, page: number, limit: number): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.solicitudUrl}/estado?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: 'response',
            params: {estado: estado},
            headers: {'Authorization': this.token}
        });
    }

    obtenerSolicitudesIdPers(idPers:number):Observable<Respuesta<Solicitud>>{
        let constUrl = `${this.solicitudUrl}/porPersona{idPers}`;
        return this.http.get<AppResponse<Solicitud>>(constUrl,{
            observe: 'response',
            headers: {'Authorization': this.token}
        })
    }

    obtenerUltimSolicitud(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.solicitudUrl}/ultima`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });

    }

    listarSolicitudNoDefinido(): Observable<Respuesta<Solicitud>> {
        let constUrl = `${this.solicitudUrl}/noDefinido`;
        return this.http.get<AppResponse<Solicitud>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    listarAllSolicitudPerso(idPersona:number): Observable<Respuesta<Solicitud>> {
        //let constUrl = `${this.solicitudUrl}/persona/${idPersona}`;
        return this.http.get<AppResponse<Solicitud>>(`${this.solicitudUrl}/persona/${idPersona}`, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    insertarSolicitud(solicitud: Solicitud): Observable<Respuesta<Solicitud>> {
        console.log(solicitud);
        return this.http.post<AppResponse<Solicitud>>(this.solicitudUrl, solicitud, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    modificarSolicitud(id: number, solicitud: Solicitud): Observable<Respuesta<Solicitud>> {
        solicitud.id = id;
        return this.http.put<AppResponse<Solicitud>>(`${this.solicitudUrl}/${id}`, solicitud, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    eliminarSolicitud(id: number): Observable<Respuesta<Solicitud>> {
        return this.http.delete<AppResponse<Solicitud>>(`${this.solicitudUrl}/${id}`, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }
}
