import { Injectable } from '@angular/core';
import {AppResponse, ConsejoPopular, Respuesta} from "../modelo";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {SERVER_URL} from "../contantes";

@Injectable({
  providedIn: 'root'
})
export class ConsejoPopularService {

    private token: string = "";
    private consejoPopularUrl = SERVER_URL + "api/consejoPopular";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarConsejoPopular(sort: string, order: string, page: number, limit: number): Observable<Respuesta<ConsejoPopular>> {
        let constUrl = `${this.consejoPopularUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<ConsejoPopular>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarTodasConsejoPopular(): Observable<Respuesta<ConsejoPopular>> {
        let constUrl = `${this.consejoPopularUrl}/todos`;
        return this.http.get<AppResponse<ConsejoPopular>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarConsejoPopularNoDefinido(nombre:string): Observable<Respuesta<ConsejoPopular>> {
        let constUrl = `${this.consejoPopularUrl+'/porNombre/'}${nombre}`;
        return this.http.get<AppResponse<ConsejoPopular>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarConsejoPopular(consejoPopular: ConsejoPopular): Observable<Respuesta<ConsejoPopular>> {
        return this.http.post<AppResponse<ConsejoPopular>>(this.consejoPopularUrl + "/nuevo", consejoPopular, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarConsejoPopular(id: number, consejoPopular: ConsejoPopular): Observable<Respuesta<ConsejoPopular>> {
        consejoPopular.id = id;
        return this.http.put<AppResponse<ConsejoPopular>>(this.consejoPopularUrl+"/mod/" + consejoPopular.id, consejoPopular, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarConsejoPopular(id: number): Observable<Respuesta<ConsejoPopular>> {
        return this.http.delete<AppResponse<ConsejoPopular>>(this.consejoPopularUrl+"/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
