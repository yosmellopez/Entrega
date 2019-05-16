import { Injectable } from '@angular/core';
import { SERVER_URL } from '../contantes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { AppResponse, Respuesta, TipoSuperficie } from '../modelo';

@Injectable({
    providedIn: 'root'
})
export class TipoSuperficieService {

    private token: string = '';
    private TipoSuperficieUrl = SERVER_URL + 'api/tipoSuperficie';

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('user_token');
    }

    listarTipoSuperficie(sort: string, order: string, page: number, limit: number): Observable<Respuesta<TipoSuperficie>> {
        let constUrl = `${this.TipoSuperficieUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<TipoSuperficie>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    listarTodasTipoSuperficie(): Observable<Respuesta<TipoSuperficie>> {
        let constUrl = `${this.TipoSuperficieUrl}/todas`;
        return this.http.get<AppResponse<TipoSuperficie>>(constUrl, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    insertarTipoSuperficie(TipoSuperficie: TipoSuperficie): Observable<Respuesta<TipoSuperficie>> {
        return this.http.post<AppResponse<TipoSuperficie>>(this.TipoSuperficieUrl + '/nueva', TipoSuperficie, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    modificarTipoSuperficie(id: number, TipoSuperficie: TipoSuperficie): Observable<Respuesta<TipoSuperficie>> {
        TipoSuperficie.id = id;
        return this.http.put<AppResponse<TipoSuperficie>>(this.TipoSuperficieUrl + '/mod/' + id, TipoSuperficie, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }

    eliminarTipoSuperficie(id: number): Observable<Respuesta<TipoSuperficie>> {
        return this.http.delete<AppResponse<TipoSuperficie>>(this.TipoSuperficieUrl + '/' + id, {
            observe: 'response',
            headers: {'Authorization': this.token}
        });
    }
}
