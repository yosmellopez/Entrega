/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Municipio;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Nodo
 */
public interface MunicipioRepositorio extends JpaRepository<Municipio, Long>{
    
}
