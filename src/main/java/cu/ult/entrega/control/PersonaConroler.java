/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Integracion;
import cu.ult.entrega.clases.Persona;

import cu.ult.entrega.clases.PersonaAyuda;
import cu.ult.entrega.clases.Solicitud;
import cu.ult.entrega.excepcion.ProvinciaException;
import cu.ult.entrega.repositorio.PersonaAyudaRepositorio;
import cu.ult.entrega.excepcion.ProvinciaException;
import cu.ult.entrega.repositorio.IntegracionRepository;
import cu.ult.entrega.repositorio.PersonaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import static cu.ult.entrega.control.AppResponse.failure;
import static cu.ult.entrega.control.AppResponse.success;

/**
 * @author Pablo Caram Local
 */
@RestController
@RequestMapping("/api")
public class PersonaConroler {

    private final PersonaRepositorio personaRepositorio;

    private final IntegracionRepository integracionRepository;

    @Autowired
    public PersonaConroler(PersonaRepositorio personaRepositorio, IntegracionRepository integracionRepository) {
        this.personaRepositorio = personaRepositorio;
        this.integracionRepository = integracionRepository;
    }

    @Autowired
    PersonaAyudaRepositorio personaAyudaRepositorio;

    @RequestMapping(value = "/persona")
    public ResponseEntity<AppResponse<Persona>> listarPersonas(Pageable p) {
        Page<Persona> page = personaRepositorio.findAll(p);
        List<Persona> personas = page.getContent();
        return ResponseEntity.ok(success(personas).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/persona/todas")
    public ResponseEntity<AppResponse<Persona>> listarTodasPersonas() {
        List<Persona> personas = personaRepositorio.findAll();
        return ResponseEntity.ok(success(personas).total(personas.size()).build());
    }

    @RequestMapping(value = "/integracion")
    public ResponseEntity<AppResponse<Integracion>> listarIntegracion() {
        List<Integracion> integracions = integracionRepository.findAll();
        return ResponseEntity.ok(success(integracions).total(integracions.size()).build());
    }

    @RequestMapping(value = "/persona/ci/{ci}")
    public ResponseEntity<AppResponse<Persona>> obtenerPersonaPorCI(@PathVariable("ci") String ci) {
        Persona persona = personaRepositorio.findByCi(ci);
        return ResponseEntity.ok(success(persona).build());
    }

    @RequestMapping(value = "/persona/{tipoPersona}")
    public ResponseEntity<AppResponse<Persona>> obtenerPersonaPorTipoPersona(@PathVariable("tipoPersona") String tipoPersona) {
        List<Persona> personas = personaRepositorio.findByTipoPersonaOrderByPrimerApellidoAsc(tipoPersona);
        return ResponseEntity.ok(success(personas).total(personas.size()).build());
    }


    @PostMapping(value = "/persona")
    public ResponseEntity<AppResponse<Persona>> insertarPersona(@Valid @RequestBody Persona persona) {
        personaRepositorio.saveAndFlush(persona);
        return ResponseEntity.ok(success(persona).build());
    }

    @PostMapping(value = "/Persona/insrtList")
    public ResponseEntity<AppResponse<Persona>> insertarListPersona(@Valid @RequestBody List<Persona> personas) {
        for (Persona persona : personas) {
            personaRepositorio.saveAndFlush(persona);
        }
        return ResponseEntity.ok(success(personas).total(personas.size()).build());
    }

    //Clases de Execciones.
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
        ProvinciaException generalException = new ProvinciaException(e);
        return ResponseEntity.ok(failure(generalException.tratarExcepcion()).build());
    }

}
