package cu.ult.entrega.control;

import cu.ult.entrega.clases.*;
import cu.ult.entrega.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import java.util.*;

import static cu.ult.entrega.control.AppResponse.success;

@RestController
@RequestMapping("/api")
public class TramiteControler {

    @Autowired
    SolicitudRepositorio solicitudRepositorio;

    @Autowired
    PersonaParcelasRepositorio personaParcelasRepositorio;

    @Autowired
    ParcelaRepositorio parcelaRepositorio;

    @Autowired
    LineaDeProduccionRepositorio lineaDeProduccionRepositorio;

    @Autowired
    ParcelaBienhechuriaRepositorio parcelaBienhechuriaRepositorio;


    @RequestMapping(value = "/tramite/investi")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcInvesti() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTipoSolicitudAndEstadoOrTipoSolicitudAndTramite_FechaEntreInvestig("Ampliacion","Tramitando Investigación","Ampliacion",null);
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @RequestMapping(value = "/tramite/medic")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcMedic() {
        List<Solicitud> regulaciones = solicitudRepositorio.findByTramite_FechaEntreMedicionOrEstado(null, "Tramitando Planificación Física");
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @RequestMapping(value = "/tramite/regulaci")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcRegulci() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTramite_FechaEntreMedicionIsNotNullAndTramite_FechaEntregaRegulacionesOrEstado(null,"Tramitando Planificación Física");
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @RequestMapping(value = "/tramite/estudioSuelo")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcEstudioSuelo() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTramite_FechaEntreMedicionIsNotNullAndTramite_FechaEntregaEstudioSueloOrEstado(null,"Tramitando Estudio de Suelo");
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @RequestMapping(value = "/tramite/valoBienhechu")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcValoBienhechu() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTramite_FechaEntreMedicionIsNotNullAndTramite_FechaEntregValoBienchuríasOrEstado(null,"Tramitando Valoración de Bienhechurías");
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @RequestMapping(value = "/tramite/aprobadoCAgraria")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcAprobadoCAgraria() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTramite_FechaEntregValoBienchuríasIsNotNullAndTramite_FechaAprobadoCAgraria(null);
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @RequestMapping(value = "/tramite/fechaAprobadoPCC")
    public ResponseEntity<AppResponse<Regulaciones>> listarSolcFechaAprobadoPCC() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTramite_FechaAprobadoCAgrariaIsNotNullAndTramite_FechaAprobadoPCC(null);
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }

    @PutMapping(value = "/tramite/modificarEstadoParc")
    public ResponseEntity<AppResponse<Solicitud>> actualizarEstadoParc(@RequestBody PersonaParcela personaParcela) {
        Date fecha = new Date();
        Solicitud currentSolicitud = solicitudRepositorio.findByPersona_IdAndTramite_FechaEntreInvestig(personaParcela.getPersonaParcelaPK().getPersonaId(),null);
        PersonaParcela currentPersonaParcela = personaParcelasRepositorio.findByPersona_IdAndParcela_Id(personaParcela.getPersonaParcelaPK().getPersonaId(),personaParcela.getPersonaParcelaPK().getParcelaId());
        if (currentSolicitud!=null){
            currentSolicitud.getTramite().setFechaEntreInvestig(fecha);
            solicitudRepositorio.saveAndFlush(currentSolicitud);
        }

        currentPersonaParcela.setAreaVacia(personaParcela.getAreaVacia());
        currentPersonaParcela.setCultOActivAgroDediAct(personaParcela.getCultOActivAgroDediAct());
        currentPersonaParcela.setExistirCausas(personaParcela.getExistirCausas());
        currentPersonaParcela.setGradoDeExplotacion(personaParcela.getGradoDeExplotacion());
        currentPersonaParcela.setNoCertTenInscrito(personaParcela.getNoCertTenInscrito());
        currentPersonaParcela.setTipoDeTenencia(personaParcela.getTipoDeTenencia());
        personaParcelasRepositorio.saveAndFlush(currentPersonaParcela);

        return ResponseEntity.ok(AppResponse.success(currentSolicitud).build());
    }

    @PutMapping(value = "/tramite/modificarParcela/{id}/{numExp}")
    public ResponseEntity<AppResponse<Parcela>> actualizarParcelaCC(@PathVariable("id") Optional<Parcela> optional,@PathVariable("numExp") Integer numExp, @Valid @RequestBody Parcela parcela) {
        Date fecha = new Date();
        Parcela currentParcela = optional.orElseThrow(() -> new EntityNotFoundException("Parcela no encontrada"));
        Solicitud currentSolicitud = solicitudRepositorio.findByNumExpedienteAndTramite_FechaEntreMedicion(numExp,null);

        if (currentSolicitud!=null){
            currentSolicitud.getTramite().setFechaEntreMedicion(fecha);
            solicitudRepositorio.saveAndFlush(currentSolicitud);
        }

        currentParcela.setZonaCatastral(parcela.getZonaCatastral());
        currentParcela.setParcela(parcela.getParcela());
        currentParcela.setDivicion(parcela.getDivicion());
        currentParcela.setCondicActual(parcela.getCondicActual());
        currentParcela.setDireccion(parcela.getDireccion());
        currentParcela.setArea(parcela.getArea());
        currentParcela.setLimiteN(parcela.getLimiteN());
        currentParcela.setLimiteS(parcela.getLimiteS());
        currentParcela.setLimiteE(parcela.getLimiteE());
        currentParcela.setLimiteW(parcela.getLimiteW());
        currentParcela.setConsejoPopular(parcela.getConsejoPopular());
        currentParcela.setTipoUso(parcela.getTipoUso());

        parcelaRepositorio.saveAndFlush(currentParcela);

        return ResponseEntity.ok(success(currentParcela).build());
    }

    @PutMapping(value = "/tramite/asignarRegulaParcela")
    public ResponseEntity<AppResponse<Solicitud>> asignarRegulacionParcela(@Valid @RequestBody List<Solicitud> solicitudes) {
        Date fecha = new Date();
        List<Solicitud> solicitudesguardas = null;

        for (Solicitud solicitud :solicitudes){
            Solicitud currentSolicitud = solicitudRepositorio.findByNumExpediente(solicitud.getNumExpediente());


            currentSolicitud.getTramite().setFechaEntregaRegulaciones(fecha);
            solicitudRepositorio.saveAndFlush(currentSolicitud);


            for (Parcela currentParcela: currentSolicitud.getParcelas()){
                for (Parcela parcela: solicitud.getParcelas()) {
                    if (currentParcela.getId() == parcela.getId()){
                        currentParcela.setRegulaciones(parcela.getRegulaciones());
                    }
                }
                parcelaRepositorio.saveAndFlush(currentParcela);
            }
        }
        return ResponseEntity.ok(success().build());
    }

    @PutMapping(value = "/tramite/asignarBienhechuParcela")
    public ResponseEntity<AppResponse<Solicitud>> asignarBienheParcela(@Valid @RequestBody List<Solicitud> solicitudes) {
        Date fecha = new Date();
        List<Solicitud> solicitudesguardas = null;

        for (Solicitud solicitud :solicitudes){
            Solicitud currentSolicitud = solicitudRepositorio.findByNumExpediente(solicitud.getNumExpediente());

            currentSolicitud.getTramite().setFechaEntregValoBienchurías(fecha);
            solicitudRepositorio.saveAndFlush(currentSolicitud);

            for (Parcela parcela: solicitud.getParcelas()) {
                for (ParcelaBienhechuria currenParcelaBienhechuria : parcela.getParcelaBienhechurias()){
                    currenParcelaBienhechuria.setParcela(parcela);
                    currenParcelaBienhechuria.setParcelaBienhechuriaPK(new ParcelaBienhechuriaPK(parcela.getId(),currenParcelaBienhechuria.getBienhechuria().getId()));
                    parcelaBienhechuriaRepositorio.saveAndFlush(currenParcelaBienhechuria);
                }
            }
        }

        return ResponseEntity.ok(success().build());
    }

    @PutMapping(value = "/tramite/aprobarDenegarLineaPro/{id}/{numExp}")
    public ResponseEntity<AppResponse<LineaDeProduccion>> aprobarDenegarLineaPro(@PathVariable("id") Optional<LineaDeProduccion> optional, @PathVariable("numExp") Integer numExp, @Valid @RequestBody LineaDeProduccion lineaDeProduccion) {
        Date fecha = new Date();
        LineaDeProduccion currenLineaDeProduccion = optional.orElseThrow(() -> new EntityNotFoundException("Línea de Producción no encontrada"));

        Solicitud currentSolicitud = solicitudRepositorio.findByNumExpediente(numExp);

        currentSolicitud.getTramite().setFechaEntregaEstudioSuelo(fecha);
        solicitudRepositorio.saveAndFlush(currentSolicitud);

       currenLineaDeProduccion.setAprobado(lineaDeProduccion.getAprobado());
       currenLineaDeProduccion.setEstudioSuelo(lineaDeProduccion.getEstudioSuelo());

       lineaDeProduccionRepositorio.saveAndFlush(currenLineaDeProduccion);

        return ResponseEntity.ok(success(currenLineaDeProduccion).build());
    }

    @PutMapping(value = "/tramite/iniciTramit/{idMatTab}")
    public ResponseEntity<AppResponse<Solicitud>> isertarIniciTramit(@PathVariable("idMatTab")Integer idMatTab, @RequestBody List<Solicitud> solicitudes) {
       Date fecha = new Date();
       Solicitud currentSolicitud = new Solicitud();

       switch (idMatTab){
           case 0:
               for (Solicitud solicitud : solicitudes){
                   if (solicitud.getTramite()==null || solicitud.getTramite().getFechaInvestig()==null) {
                       currentSolicitud = solicitudRepositorio.getOne(solicitud.getId());
                       if (currentSolicitud.getTramite() == null) {
                           currentSolicitud.setTramite(new Tramite());
                           currentSolicitud.setEstado("Tramitando Investigación");
                           currentSolicitud.getTramite().setFechaInvestig(fecha);
                           currentSolicitud.getTramite().setSolicitud(currentSolicitud);
                       } else {
                           currentSolicitud.setEstado("Tramitando Investigación");
                           currentSolicitud.getTramite().setFechaInvestig(fecha);
                       }
                       solicitudRepositorio.saveAndFlush(currentSolicitud);
                   }
               }
               break;
           case 1:
               for (Solicitud solicitud : solicitudes){
                   if (solicitud.getTramite()==null || solicitud.getTramite().getFechaConcilONHG()==null) {
                       currentSolicitud = solicitudRepositorio.getOne(solicitud.getId());
                       if (currentSolicitud.getTramite() == null) {
                           currentSolicitud.setTramite(new Tramite());
                           currentSolicitud.setEstado("Tramitando Planificación Física");
                           currentSolicitud.getTramite().setFechaConcilONHG(fecha);
                           currentSolicitud.getTramite().setFechaConcPlanFis(fecha);
                           currentSolicitud.getTramite().setSolicitud(currentSolicitud);
                       } else {
                           currentSolicitud.setEstado("Tramitando Planificación Física");
                           currentSolicitud.getTramite().setFechaConcilONHG(fecha);
                           currentSolicitud.getTramite().setFechaConcPlanFis(fecha);
                       }
                       solicitudRepositorio.saveAndFlush(currentSolicitud);
                   }
               }
               break;
           case 3:
               for (Solicitud solicitud : solicitudes){
                   if (solicitud.getTramite()==null || solicitud.getTramite().getFechaConcInstSuelo()==null) {
                       currentSolicitud = solicitudRepositorio.getOne(solicitud.getId());
                       if (currentSolicitud.getTramite() == null) {
                           currentSolicitud.setTramite(new Tramite());
                           currentSolicitud.setEstado("Tramitando Estudio de Suelo");
                           currentSolicitud.getTramite().setFechaConcInstSuelo(fecha);
                           currentSolicitud.getTramite().setSolicitud(currentSolicitud);
                       } else {
                           currentSolicitud.setEstado("Tramitando Estudio de Suelo");
                           currentSolicitud.getTramite().setFechaConcInstSuelo(fecha);
                       }
                       solicitudRepositorio.saveAndFlush(currentSolicitud);
                   }
               }
               break;
           case 4:
               for (Solicitud solicitud : solicitudes){
                   if (solicitud.getTramite()==null || solicitud.getTramite().getFechaConcEmpAgric()==null) {
                       currentSolicitud = solicitudRepositorio.getOne(solicitud.getId());
                       if (currentSolicitud.getTramite() == null) {
                           currentSolicitud.setTramite(new Tramite());
                           currentSolicitud.setEstado("Tramitando Valoración de Bienhechurías");
                           currentSolicitud.getTramite().setFechaConcEmpAgric(fecha);
                           currentSolicitud.getTramite().setSolicitud(currentSolicitud);
                       } else {
                           currentSolicitud.setEstado("Tramitando Valoración de Bienhechurías");
                           currentSolicitud.getTramite().setFechaConcEmpAgric(fecha);
                       }
                       solicitudRepositorio.saveAndFlush(currentSolicitud);
                   }
               }
               break;
           default:
               break;

       }
       return ResponseEntity.ok(AppResponse.success(solicitudes).build());
    }
}
