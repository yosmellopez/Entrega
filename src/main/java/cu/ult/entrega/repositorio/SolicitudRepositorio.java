/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.repositorio;

import cu.ult.entrega.clases.ConsejoPopular;
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

    public Solicitud findByNumExpediente(Integer numExpediente);

    public List<Solicitud> findByPersona_Id(long id);

    public Solicitud findByPersona_IdAndTramite_FechaEntreInvestig(long id, Date fechaEntreInvestig);

    public Solicitud findByNumExpedienteAndTramite_FechaEntreMedicion(Integer id, Date Medicion);

    public Solicitud findByNumExpedienteAndTramite_FechaEntregaRegulaciones(Integer id, Date Medicion);

    public List<Solicitud> findByEstado(String estado);

    public Page<Solicitud> findByEstadoIsNot(String estado, Pageable pageable);

    public Solicitud findTopByOrderByNumExpedienteDesc();

    public List<Solicitud> findByTipoSolicitudAndEstadoOrTipoSolicitudAndTramite_FechaEntreInvestig(String tipoSolicitud,String Estado,String tipoSolicitud1, Date fechaEntreInvestig);

    public List<Solicitud> findByTramite_FechaEntreMedicionOrEstado(Date fechaEntreMedicion, String estado);

    public List<Solicitud> findByTramite_FechaEntreMedicionIsNotNullAndTramite_FechaEntregaRegulacionesOrEstado(Date fechaEntregaRegulaciones, String estado);

    public List<Solicitud> findByTramite_FechaEntreMedicionIsNotNullAndTramite_FechaEntregaEstudioSueloOrEstado( Date fechaEntregaEstudioSuelo, String estado);

    public List<Solicitud> findByTramite_FechaEntreMedicionIsNotNullAndTramite_FechaEntregValoBienchuríasOrEstado(Date fechaEntregValoBienchurías, String estado);

    public List<Solicitud> findByTramite_FechaEntregValoBienchuríasIsNotNullAndTramite_FechaAprobadoCAgraria( Date fechaAprobadoCAgraria);

    public List<Solicitud> findByTramite_FechaAprobadoCAgrariaIsNotNullAndTramite_FechaAprobadoPCC( Date fechaAprobadoPCC);
}
