/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 *
 * @author Pablo Caram Local
 */
public interface PersonaRepositorio extends JpaRepository<Persona, Long>{

    public List<Persona> findByTipoPersonaOrderByPrimerApellidoAsc(String tipoPersona);
    
    public Persona findByCi(String ci);
}
