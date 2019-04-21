import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {SERVER_URL} from "../contantes";
import {AppResponse, Respuesta, Rol, Usuario} from "../modelo";

@Injectable({providedIn: 'root'})
export class UsuarioService {

    loginUrl = SERVER_URL + "api/auth/login";
    private usuarioUrl = SERVER_URL + "api/usuario";
    private rolUrl = SERVER_URL + "api/roles";
    private token: string = "";

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem("user_token");
    }

    listarUsuarios(sort: string, order: string, page: number, limit: number): Observable<Respuesta<Usuario>> {
        let constUrl = `${this.usuarioUrl}?sort=${sort},${order}&page=${page + 1}&limit=${limit}`;
        return this.http.get<AppResponse<Usuario>>(constUrl, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }


    insertarUsuario(usuario: Usuario): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(this.usuarioUrl, usuario, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    registrarUsuario(usuario: Usuario): Observable<Respuesta<Usuario>> {
        return this.http.post<AppResponse<Usuario>>(this.usuarioUrl+"/registro", usuario, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    modificarUsuario(id: number, usuario: Usuario): Observable<Respuesta<Usuario>> {
        usuario.id = id;
        return this.http.put<AppResponse<Usuario>>(this.usuarioUrl + "/" + id, usuario, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    eliminarUsuario(id: number): Observable<Respuesta<Usuario>> {
        return this.http.delete<AppResponse<Usuario>>(this.usuarioUrl + "/" + id, {
            observe: "response",
            headers: {"Authorization": this.token}
        });
    }

    obtenerRol(id:number):Observable<Respuesta<Rol>>{
       return this.http.get<AppResponse<Rol>>(this.rolUrl+"/"+id,{
           observe: "response",
           headers: {"Authorization": this.token}
       });

    }

    listarRoles():Observable<Respuesta<Rol>>{
        return this.http.get<AppResponse<Rol>>(this.rolUrl,{
            observe: "response",
            headers: {"Authorization": this.token}
        });

    }
}




