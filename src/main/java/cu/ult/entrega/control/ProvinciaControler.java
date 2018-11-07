/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Provincia;
import cu.ult.entrega.excepcion.ProvinciaException;
import cu.ult.entrega.repositorio.ProvinciaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static cu.ult.entrega.control.AppResponse.failure;
import static cu.ult.entrega.control.AppResponse.success;


@RestController
@RequestMapping("/api")
public class ProvinciaControler {

    @Autowired
    ProvinciaRepositorio provinciaRepositorio;

    @RequestMapping(value = "/provincia")
    public ResponseEntity<AppResponse<Provincia>> listarProvincias(Pageable p) {
        Page<Provincia> page = provinciaRepositorio.findAll(p);
        List<Provincia> provincias = page.getContent();
        return ResponseEntity.ok(success(provincias).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/provincia/todas")
    public ResponseEntity<AppResponse<Provincia>> listarTodasProvincias() {
        List<Provincia> provincias = provinciaRepositorio.findAll();
        return ResponseEntity.ok(success(provincias).total(provincias.size()).build());
    }

    @PostMapping(value = "/provincia/nueva")
    public ResponseEntity<AppResponse<Provincia>> insertarProvincia(@Valid @RequestBody Provincia provincia) {
        provinciaRepositorio.saveAndFlush(provincia);
        return ResponseEntity.ok(success(provincia).build());
    }

    @PutMapping(value = "/provincia/{id}")
    public ResponseEntity<AppResponse<Provincia>> actualizarProvincia(@PathVariable("id") Optional<Provincia> optional, @Valid @RequestBody Provincia provincia) {
        Provincia currentProvinc = optional.orElseThrow(() -> new EntityNotFoundException("Provincia no encontrado"));
        currentProvinc.setCodigo(provincia.getCodigo());
        currentProvinc.setNombre(provincia.getNombre());
        provinciaRepositorio.saveAndFlush(currentProvinc);
        return ResponseEntity.ok(success(provincia).build());
    }

    @DeleteMapping(value = "/provincia/{id}")
    public ResponseEntity<AppResponse> deleteProvincia(@PathVariable("id") Optional<Provincia> optional) {
        Provincia provincia = optional.orElseThrow(() -> new EntityNotFoundException("Provinca no encontrada."));
        provinciaRepositorio.delete(provincia);
        return ResponseEntity.ok(AppResponse.success("Provincia eliminada exitosamente.").build());
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
        ProvinciaException generalException = new ProvinciaException(e);
        return ResponseEntity.ok(failure(generalException.tratarExcepcion()).build());
    }

}