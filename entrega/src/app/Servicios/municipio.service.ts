import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {AppResponse, Municipio, Respuesta, Usuario} from "../modelo";
import {SERVER_URL} from "../contantes";


@Injectable({
    providedIn: 'root'
})
export class MunicipioService {

    private token: string = "";
    private MunicipioUrl = SERVER_URL + "api/Municipio";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarMunicipio(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Municipio>> {
        let constUrl = `${this.MunicipioUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Municipio>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarMunicipio(Municipio: Municipio): Observable<Respuesta<Municipio>> {
        return this.http.post<AppResponse<Municipio>>(this.MunicipioUrl + "/nueva", Municipio, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarMunicipio(id: number, Municipio: Municipio): Observable<Respuesta<Municipio>> {
        Municipio.id = id;
        return this.http.put<AppResponse<Municipio>>(SERVER_URL + "api/Municipio/mod/" + id, Municipio, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarMunicipio(id: number): Observable<Respuesta<Municipio>> {
        return this.http.delete<AppResponse<Municipio>>(SERVER_URL + "api/Municipio/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
