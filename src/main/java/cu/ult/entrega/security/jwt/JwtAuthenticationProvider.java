package cu.ult.entrega.security.jwt;


import cu.ult.entrega.clases.Usuario;
import cu.ult.entrega.repositorio.UsuarioRepository;
import cu.ult.entrega.security.jwt.token.RawAccessJwtToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.persistence.EntityNotFoundException;

@Component
@SuppressWarnings("unchecked")
public class JwtAuthenticationProvider implements AuthenticationProvider {

    private final JwtSettings jwtSettings;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    public JwtAuthenticationProvider(JwtSettings jwtSettings) {
        this.jwtSettings = jwtSettings;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        RawAccessJwtToken rawAccessToken = (RawAccessJwtToken) authentication.getCredentials();
        Jws<Claims> jwsClaims = rawAccessToken.parseClaims(jwtSettings.getTokenSigningKey());
        String subject = jwsClaims.getBody().getSubject();
        System.out.println(subject);
        Usuario user = usuarioRepository.findByUsername(subject).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        JwtAuthenticationToken jwtAuthenticationToken = new JwtAuthenticationToken(user, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(jwtAuthenticationToken);
        return jwtAuthenticationToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (JwtAuthenticationToken.class.isAssignableFrom(authentication));
    }
}