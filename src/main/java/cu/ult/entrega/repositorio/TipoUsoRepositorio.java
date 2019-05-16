/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.TipoSuperficie;
import cu.ult.entrega.clases.TipoUso;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @author Pablo Caram Local
 */
public interface TipoUsoRepositorio extends JpaRepository<TipoUso, Long> {

    TipoUso findByNombre(String nombre);

    List<TipoUso> findByTipoSuperficie(TipoSuperficie tipoDeSuperficie);
}
