package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Usuario;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    @EntityGraph(attributePaths = "comentarios")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE)
    Optional<Usuario> findOneByUsername(String username);
}
