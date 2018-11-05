/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.TipoDeSuperficie;
import cu.ult.entrega.clases.TipoDeUso;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Pablo Caram Local
 */
public interface TipoDeUsoRepositorio extends JpaRepository<TipoDeUso, Long> {

    public List<TipoDeUso> findByTipoDeSuperficie(TipoDeSuperficie tipoDeSuperficie);
}
