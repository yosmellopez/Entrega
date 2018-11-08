/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Http401UnauthorizedEntryPoint implements AuthenticationEntryPoint {
    
    private final Logger log = LoggerFactory.getLogger(Http401UnauthorizedEntryPoint.class);
    
    public Http401UnauthorizedEntryPoint() {
    }
    
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        this.log.debug("Pre-authenticated entry point called. Rejecting access");
//        response.sendError(401, "Acceso denegado al recurso existente. Debe estar autenticado para acceder a este");
        System.out.println(rutaSistema(request.getRequestURI()));
        response.sendRedirect(rutaSistema(request.getRequestURI()));
    }
    
    private String rutaSistema(String path) {
        int start = path.indexOf("/");
        int end = path.indexOf("/", start + 1);
        return path.substring(start, end) + "/login.html#";
    }
    
}
