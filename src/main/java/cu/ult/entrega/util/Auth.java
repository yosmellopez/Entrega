package cu.ult.entrega.util;

import cu.ult.entrega.clases.Usuario;

public class Auth {

    private Usuario usuario;

    private boolean authenticated;

    public Usuario getUsuario() {
        return usuario;
    }

    public static Auth create(Usuario usuario, boolean authenticated) {
        Auth auth = new Auth();
        auth.setAuthenticated(authenticated);
        auth.setUsuario(usuario);
        return auth;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }

    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }
}
