import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {AppResponse, Bienhechuria, Respuesta} from "../modelo";
import {SERVER_URL} from "../contantes";

@Injectable({
  providedIn: 'root'
})
export class BienhechuriaService {

    private token: string = "";
    private bienhechuriaUrl = SERVER_URL + "api/bienhechuria";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarBienhechuria(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Bienhechuria>> {
        let constUrl = `${this.bienhechuriaUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Bienhechuria>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    insertarBienhechuria(bienhechuria: Bienhechuria): Observable<Respuesta<Bienhechuria>> {
        return this.http.post<AppResponse<Bienhechuria>>(this.bienhechuriaUrl, bienhechuria, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarBienhechuria(id: number, bienhechuria: Bienhechuria): Observable<Respuesta<Bienhechuria>> {
        bienhechuria.id = id;
        return this.http.put<AppResponse<Bienhechuria>>(`${this.bienhechuriaUrl}/${id}`, bienhechuria, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }
}
