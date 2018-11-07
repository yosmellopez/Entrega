import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {AppResponse, Provincia, Respuesta, Usuario} from "../modelo";
import {SERVER_URL} from "../contantes";


@Injectable({
    providedIn: 'root'
})
export class ProvinciaService {

    private token: string = "";
    private provinciaUrl = SERVER_URL + "api/provincia";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarProvincia(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Provincia>> {
        let constUrl = `${this.provinciaUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        console.log(constUrl);
        return this.http.get<AppResponse<Provincia>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarProvincia(provincia: Provincia): Observable<Respuesta<Provincia>> {
        console.log(provincia);
        return this.http.post<AppResponse<Provincia>>(this.provinciaUrl + "/nueva", provincia, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarProvincia(id: number, provincia: Provincia): Observable<Respuesta<Provincia>> {
        provincia.id = id;
        console.log(provincia);
        return this.http.put<AppResponse<Provincia>>(SERVER_URL + "api/provincia/mod/" + id, provincia, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarProvincia(id: number): Observable<Respuesta<Provincia>> {
        console.log(id);
        return this.http.delete<AppResponse<Provincia>>(SERVER_URL + "api/provincia/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    iniciarSesion(values: any): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(SERVER_URL + 'api/auth/login', values, {observe: 'response'});
    }
}