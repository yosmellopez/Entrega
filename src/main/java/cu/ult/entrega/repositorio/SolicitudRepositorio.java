/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.Persona;
import cu.ult.entrega.clases.Solicitud;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;


/**
 * @author Pablo Caram Local
 */

public interface SolicitudRepositorio extends JpaRepository<Solicitud, Long> {

    public Solicitud findByNumExpediente(String numExpediente);

    public List<Solicitud> findByEstado(String estado);

    public Page<Solicitud> findByEstado(String estado, Pageable pageable);

    public Solicitud findTopByOrderByNumExpedienteDesc();

    public List<Solicitud> findByTipoSolicitudAndTramite_FechaEntreInvestig(String tipoSolicitud, Date fechaEntreInvestig);
}
