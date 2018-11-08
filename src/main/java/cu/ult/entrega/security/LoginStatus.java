/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.security;

import cu.ult.entrega.clases.Usuario;

public class LoginStatus {

    private final boolean loggedIn;

    private final Usuario username;

    private final String msg;

    private String token;

    private String page;

    private final long id;

    public LoginStatus(boolean loggedIn, Usuario username, String msg) {
        this.loggedIn = loggedIn;
        this.username = username;
        this.msg = msg;
        id = 0;
    }

    public LoginStatus(boolean loggedIn, Usuario username, String msg, long id) {
        this.loggedIn = loggedIn;
        this.username = username;
        this.msg = msg;
        this.id = id;
    }

    public boolean isLoggedIn() {
        return loggedIn;
    }

    public Usuario getUsername() {
        return username;
    }

    public String getMsg() {
        return msg;
    }

    public long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }

}
