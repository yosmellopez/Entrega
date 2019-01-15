/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.LineaDeProduccion;
import cu.ult.entrega.clases.Parcela;
import cu.ult.entrega.clases.Solicitud;
import cu.ult.entrega.repositorio.LineaDeProduccionRepositorio;
import cu.ult.entrega.repositorio.ParcelaRepositorio;
import cu.ult.entrega.repositorio.SolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.persistence.EntityNotFoundException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static cu.ult.entrega.control.AppResponse.success;

/**
 * @author Pablo Caram Local
 */
@RestController
@RequestMapping("/api")
public class SolicitudControler {

    @Autowired
    SolicitudRepositorio solicitudRepositorio;

    @Autowired
    ParcelaRepositorio parcelaRepositorio;

    @Autowired
    LineaDeProduccionRepositorio lineaDeProduccionRepositorio;

    @RequestMapping(value = "/solicitud")
    public ResponseEntity<AppResponse<Solicitud>> listarSolicitud(Pageable p) {
        Page<Solicitud> page = solicitudRepositorio.findAll(p);
        List<Solicitud> solicituds = page.getContent();
        return ResponseEntity.ok(success(solicituds).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/solicitud/estado/{estado}")
    public ModelAndView listarSolicitudesEstado(@PathVariable("estado") String estado, ModelMap map) {

        List<Solicitud> solicitudes = solicitudRepositorio.findByEstado(estado);
        map.put("solicitudes", solicitudes);
        map.put("cant", solicitudes.size());

        if (solicitudes.isEmpty()) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/solicitud/una/{numExp}")
    public ModelAndView obtenerSolicitud(@PathVariable("numExp") String numExp, ModelMap map) {

        Solicitud solicitud = solicitudRepositorio.findByNumExpediente(numExp);
        map.put("solicitu", solicitud);
        map.put("cant", 1);

        if (solicitud == null) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/solicitud/ultima")
    public ResponseEntity<AppResponse<Solicitud>> obtenerLaUltimaSolicitud (){
       Solicitud solicitud = solicitudRepositorio.findTopByOrderByNumExpedienteDesc();
       return ResponseEntity.ok(success(solicitud).build());
    }

    @PostMapping(value = "/solicitud")
    public ResponseEntity<AppResponse<Solicitud>> insertarSolicitud(@RequestBody Solicitud solicitud) {
        Set<Parcela> parcelas = solicitud.getParcelas();
        Set<Parcela> parcelasGuardadas = new HashSet<>();
        List<LineaDeProduccion> lineasDeProduccion = solicitud.getLineasDeProduccion();
        for (Parcela parcela : parcelas) {
            parcelasGuardadas.add(parcelaRepositorio.saveAndFlush(parcela));
        }
        solicitud.setParcelas(parcelasGuardadas);
        solicitudRepositorio.saveAndFlush(solicitud);
        for (LineaDeProduccion lineaDeProduccion : lineasDeProduccion){
            lineaDeProduccion.setSolicitud(solicitud);
            lineaDeProduccionRepositorio.saveAndFlush(lineaDeProduccion);
        }

        return ResponseEntity.ok(AppResponse.success(solicitud).build());
    }

    @RequestMapping(value = "/solicitud/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Solicitud> updateUser(@PathVariable("id") long id, @RequestBody Solicitud solicitud) {
        System.out.println("Updating User " + id);

        Solicitud currentSolicitud = solicitudRepositorio.findById(id).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));

        if (currentSolicitud == null) {
            System.out.println("User with id " + id + " not found");
            return new ResponseEntity<Solicitud>(HttpStatus.NOT_FOUND);
        }

        currentSolicitud.setFechaSolicitud(solicitud.getFechaSolicitud());
        currentSolicitud.setTipoSolicitud(solicitud.getTipoSolicitud());
        currentSolicitud.setAreaSolicitada(solicitud.getAreaSolicitada());
        currentSolicitud.setEstado(solicitud.getEstado());
        currentSolicitud.setFechaAproDes(solicitud.getFechaAproDes());

        solicitudRepositorio.saveAndFlush(currentSolicitud);
        return new ResponseEntity<Solicitud>(currentSolicitud, HttpStatus.OK);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse> tratarExcepciones(Exception e) {
        e.printStackTrace();
        return ResponseEntity.ok(AppResponse.failure(e.getLocalizedMessage()).build());
    }

}
