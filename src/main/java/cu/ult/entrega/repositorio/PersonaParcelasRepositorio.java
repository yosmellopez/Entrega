package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.PersonaParcela;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaParcelasRepositorio extends JpaRepository<PersonaParcela, Long> {

    PersonaParcela findByPersona_IdAndParcela_Id (long id , long idp);
}
