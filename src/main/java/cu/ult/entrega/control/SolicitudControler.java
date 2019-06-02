/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.*;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.excepcion.SolicitudException;
import cu.ult.entrega.repositorio.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.ModelMap;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.*;
import java.util.stream.Collectors;

import static cu.ult.entrega.control.AppResponse.failure;
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

    @Autowired
    PersonaRepositorio personaRepositorio;

    @Autowired
    PersonaAyudaRepositorio personaAyudaRepositorio;

    @RequestMapping(value = "/solicitud")
    public ResponseEntity<AppResponse<Solicitud>> listarSolicitud(Pageable p) {
        Page<Solicitud> page = solicitudRepositorio.findAll(p);
        List<Solicitud> solicituds = page.getContent();
        return ResponseEntity.ok(success(solicituds).total(page.getTotalElements()).build());
    }

    @GetMapping(value = "/solicitud/estado")
    public ResponseEntity<AppResponse<Solicitud>> listarSolicitudesEstado(Pageable pageable, @RequestParam("estado") String estado) {
        Page<Solicitud> page = solicitudRepositorio.findByEstadoIsNot(estado, pageable);
        return ResponseEntity.ok(success(page.getContent()).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/solicitud/una/{numExp}")
    public ModelAndView obtenerSolicitud(@PathVariable("numExp") Integer numExp, ModelMap map) {

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

    @GetMapping(value = "/solicitud/persona/{id}")
    public ResponseEntity<AppResponse<Solicitud>> listarAllSolicitudPerso(@PathVariable("id") long id) {
        List<Solicitud> solicitudes = solicitudRepositorio.findByPersona_Id(id);
        return ResponseEntity.ok(success(solicitudes).total(solicitudes.size()).build());
    }

    @RequestMapping(value = "/solicitud/ultima")
    public ResponseEntity<AppResponse<Solicitud>> obtenerLaUltimaSolicitud() {
        Solicitud solicitud = solicitudRepositorio.findTopByOrderByNumExpedienteDesc();
        if (solicitud != null) {
            return ResponseEntity.ok(success(solicitud).total(1).build());
        } else {
            return ResponseEntity.ok(success(solicitud).build());
        }

    }

    @PostMapping(value = "/solicitud")
    public ResponseEntity<AppResponse<Solicitud>> insertarSolicitud(@RequestBody Solicitud solicitud) {
        //System.out.println(solicitud.getPersona().getPersonas());
        List<PersonaAyuda> personasAyuda = solicitud.getPersona().getPersonasAyuda();
        Persona persona = solicitud.getPersona();
        Set<Parcela> parcelas = solicitud.getParcelas();
        Set<Parcela> parcelasGuardadas = new HashSet<>();
        List<LineaDeProduccion> lineasDeProduccion = solicitud.getLineasDeProduccion();

        for (Parcela parcela : parcelas) {
            parcelasGuardadas.add(parcelaRepositorio.saveAndFlush(parcela));
        }

        solicitud.setParcelas(parcelasGuardadas);

        solicitud.setPersona(solicitud.getPersona());

        solicitudRepositorio.saveAndFlush(solicitud);

        for (PersonaAyuda personaAyuda : personasAyuda) {
            if (personaAyuda.getId()!=null){
                PersonaAyuda currentPersoAyu = personaAyudaRepositorio.getOne(personaAyuda.getId());
                currentPersoAyu.setCi(personaAyuda.getCi());
                currentPersoAyu.setNombre(personaAyuda.getNombre());
                currentPersoAyu.setPrimerApellido(personaAyuda.getPrimerApellido());
                currentPersoAyu.setSegundoApellido(personaAyuda.getSegundoApellido());
                currentPersoAyu.setParentesco(personaAyuda.getParentesco());
                personaAyudaRepositorio.saveAndFlush(currentPersoAyu);
            }else{
                personaAyuda.setPersona(solicitud.getPersona());
                personaAyudaRepositorio.saveAndFlush(personaAyuda);
            }
        }

        for (LineaDeProduccion lineaDeProduccion : lineasDeProduccion) {
            lineaDeProduccion.setSolicitud(solicitud);
            lineaDeProduccionRepositorio.saveAndFlush(lineaDeProduccion);
        }

        return ResponseEntity.ok(AppResponse.success(solicitud).build());
    }

    @PutMapping(value = "/solicitud/{id}")
    public ResponseEntity<AppResponse<Solicitud>> actualizarSolicitud(@PathVariable("id") Optional<Solicitud> optional, @RequestBody Solicitud solicitud) {
        //Persona
        Set<Parcela> parcelas = solicitud.getParcelas();
        Set<Parcela> parcelasGuardadas = new HashSet<>();
        Solicitud currentSolicitud = optional.orElseThrow(() -> new EntityNotFoundException("Solicitud no encontrada"));

        currentSolicitud.setTipoSolicitud(solicitud.getTipoSolicitud());
        currentSolicitud.setAreaSolicitada(solicitud.getAreaSolicitada());
        currentSolicitud.setEstado(solicitud.getEstado());
        currentSolicitud.clonar(solicitud);
        solicitudRepositorio.saveAndFlush(currentSolicitud);
        return ResponseEntity.ok(AppResponse.success(currentSolicitud).build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse> tratarValidacion(MethodArgumentNotValidException ex, Locale locale) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        String mensaje = fieldErrors.parallelStream().map(error -> error.getDefaultMessage()).collect(Collectors.joining(", "));
        return ResponseEntity.ok(failure(mensaje).build());
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<AppResponse> tratarValidacion(ConstraintViolationException ex, Locale locale) {
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        String mensaje = violations.parallelStream().map(error -> error.getMessage()).collect(Collectors.joining(", "));
        return ResponseEntity.ok(failure(mensaje).build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse> mostrarError(Exception e) {
        SolicitudException generalException = new SolicitudException(e);
        return ResponseEntity.ok(failure(generalException.tratarExcepcion()).build());
    }

}
