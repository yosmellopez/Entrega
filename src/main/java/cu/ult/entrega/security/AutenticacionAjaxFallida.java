package cu.ult.entrega.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import cu.ult.entrega.control.AppResponse;
import io.jsonwebtoken.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static cu.ult.entrega.control.AppResponse.failure;

@Component
public class AutenticacionAjaxFallida extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private ObjectMapper mapeadorObjetos;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        int scOk = HttpServletResponse.SC_OK;
        response.setContentType("application/json;charset=UTF-8");
        response.setHeader("Accept", "application/json");
        if (exception instanceof AuthenticationServiceException) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "No autorizado");
        } else {
            response.setStatus(scOk);
        }
        Throwable cause = exception.getCause();
        if (cause instanceof SignatureException) {
            response.setStatus(HttpServletResponse.SC_OK);
        }
        if (request.getRequestURI().contains("/auth/autenticated")) {
            response.getWriter().print(mapeadorObjetos.writeValueAsString(failure(false).build()));
        } else {
            response.getWriter().print(mapeadorObjetos.writeValueAsString(failure(exception.getLocalizedMessage()).build()));
        }
        response.getWriter().flush();
    }
}
