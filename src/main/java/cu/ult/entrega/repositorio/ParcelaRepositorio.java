/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Parcela;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Pablo Caram Local
 */
public interface ParcelaRepositorio extends JpaRepository<Parcela, Long>{

    public Parcela findByZonaCatastralAndParcelaAndDivicion (Integer zonaCatastral, Integer parcela, Integer divicion);
    
}
