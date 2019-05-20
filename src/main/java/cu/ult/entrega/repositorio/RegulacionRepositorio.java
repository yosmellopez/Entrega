package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Regulaciones;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegulacionRepositorio extends JpaRepository <Regulaciones, Long> {
}
