package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Rol;
import cu.ult.entrega.clases.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    List<Usuario> findByRol(Rol rol);
}
