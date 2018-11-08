package cu.ult.entrega.repositorio;


import cu.ult.entrega.clases.Traza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TrazaRepository extends JpaRepository<Traza, Long>, JpaSpecificationExecutor<Traza> {
    
}
