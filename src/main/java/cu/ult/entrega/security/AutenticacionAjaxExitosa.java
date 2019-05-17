package cu.ult.entrega.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import cu.ult.entrega.AppConstants;
import cu.ult.entrega.clases.Usuario;
import cu.ult.entrega.control.AppResponse;
import cu.ult.entrega.repositorio.UsuarioRepository;
import cu.ult.entrega.security.jwt.JwtSettings;
import cu.ult.entrega.security.jwt.token.JwtToken;
import cu.ult.entrega.security.jwt.token.JwtTokenFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;

@Component
public class AutenticacionAjaxExitosa implements AuthenticationSuccessHandler {

    @Autowired
    private JwtTokenFactory tokenFactory;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_OK);
        Usuario usuario = (Usuario) authentication.getPrincipal();
        usuario.setLastLogin(LocalDateTime.now());
        usuarioRepository.saveAndFlush(usuario);
        if (request.getRequestURI().contains(AppConstants.AUTHENTICATION_URL)) {
            response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
            JwtToken accessToken = tokenFactory.createAccessJwtToken(usuario);
            response.addHeader(JwtSettings.AUTHORIZATION_HEADER, accessToken.getToken());
            Cookie cookie = new Cookie("LOCALIZATOR_BUS", "" + new Date().getTime());
            cookie.setHttpOnly(true);
            response.addCookie(cookie);
            response.getWriter().print(objectMapper.writeValueAsString(AppResponse.success(usuario).msg("Usuario autenticado exitosamente.").build()));
        } else {
            response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
            Cookie cookie = new Cookie("LOCALIZATOR_BUS", "" + new Date().getTime());
            cookie.setHttpOnly(true);
            response.addCookie(cookie);
            JwtToken accessToken = tokenFactory.createAccessJwtToken(usuario);
            response.addHeader(JwtSettings.AUTHORIZATION_HEADER, accessToken.getToken());
            DefaultSavedRequest savedRequest = (DefaultSavedRequest) request.getSession().getAttribute("SPRING_SECURITY_SAVED_REQUEST");
            if (savedRequest != null) {
                String requestURL = savedRequest.getRequestURL();
            } else {
                response.getWriter().print(objectMapper.writeValueAsString(AppResponse.success(usuario).build()));
            }
            response.getWriter().flush();
        }
    }

    public UsuarioRepository getUsuarioRepository() {
        return usuarioRepository;
    }

    public void setUsuarioRepository(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
}
