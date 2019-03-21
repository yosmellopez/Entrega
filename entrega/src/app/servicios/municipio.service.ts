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
    private municipioUrl = SERVER_URL + "api/municipio";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarMunicipio(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Municipio>> {
        let constUrl = `${this.municipioUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Municipio>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    listarTodosMunicipio(): Observable<Respuesta<Municipio>> {
        let constUrl = `${this.municipioUrl}/todos`;
        return this.http.get<AppResponse<Municipio>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    obtenerMunicipioPorCodigo(codigo:string): Observable<Respuesta<Municipio>> {
        let constUrl = `${this.municipioUrl}/${codigo}`;
        return this.http.get<AppResponse<Municipio>>(constUrl, {
            observe:"response",
            headers:{"Authorization":this.token}

        })
    }

    insertarMunicipio(municipio: Municipio): Observable<Respuesta<Municipio>> {
        return this.http.post<AppResponse<Municipio>>(this.municipioUrl, municipio, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarMunicipio(id: number, municipio: Municipio): Observable<Respuesta<Municipio>> {
        municipio.id = id;
        return this.http.put<AppResponse<Municipio>>(`${this.municipioUrl}/${id}`, municipio, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarMunicipio(id: number): Observable<Respuesta<Municipio>> {
        return this.http.delete<AppResponse<Municipio>>(`${this.municipioUrl}/${id}`, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
