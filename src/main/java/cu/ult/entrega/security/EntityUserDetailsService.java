package cu.ult.entrega.security;

import cu.ult.entrega.clases.Usuario;
import cu.ult.entrega.repositorio.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service("userDetailsService")
public class EntityUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(EntityUserDetailsService.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        Optional<Usuario> userFromDatabase = usuarioRepository.findOneByUsername(login.toLowerCase());
        return userFromDatabase.orElseThrow(() -> new UsernameNotFoundException("Nombre usuario o contraseña incorrectos"));
    }
}
