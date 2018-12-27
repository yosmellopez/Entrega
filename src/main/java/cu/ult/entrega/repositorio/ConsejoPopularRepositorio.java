package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.ConsejoPopular;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface ConsejoPopularRepositorio extends JpaRepository <ConsejoPopular, Long> {

    public ConsejoPopular findByNombre(String nombre);
}
