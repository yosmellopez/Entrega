/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Municipio;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.repositorio.MunicipioRepositorio;
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
public class MunicipioControler {

    @Autowired
    MunicipioRepositorio MunicipioRepositorio;

    @RequestMapping(value = "/Municipio")
    public ResponseEntity<AppResponse<Municipio>> listarMunicipios(Pageable p) {
        Page<Municipio> page = MunicipioRepositorio.findAll(p);
        List<Municipio> Municipios = page.getContent();
        return ResponseEntity.ok(success(Municipios).total(page.getTotalElements()).build());
    }

    @PostMapping(value = "/Municipio/nueva")
    public ResponseEntity<AppResponse<Municipio>> insertarMunicipio(@Valid @RequestBody Municipio Municipio) {
        MunicipioRepositorio.saveAndFlush(Municipio);
        return ResponseEntity.ok(success(Municipio).build());
    }

    @PutMapping(value = "/Municipio/{id}")
    public ResponseEntity<AppResponse<Municipio>> actualizarMunicipio(@PathVariable("id") Optional<Municipio> optional, @Valid @RequestBody Municipio Municipio) {
        Municipio currentProvinc = optional.orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
        currentProvinc.setCodigo(Municipio.getCodigo());
        currentProvinc.setNombre(Municipio.getNombre());
        MunicipioRepositorio.saveAndFlush(currentProvinc);
        return ResponseEntity.ok(success(Municipio).build());
    }

    @DeleteMapping(value = "/Municipio/{id}")
    public ResponseEntity<AppResponse> deleteMunicipio(@PathVariable("id") Optional<Municipio> optional) {
        Municipio Municipio = optional.orElseThrow(() -> new EntityNotFoundException("Provinca no encontrada."));
        MunicipioRepositorio.delete(Municipio);
        return ResponseEntity.ok(AppResponse.success("Municipio eliminada exitosamente.").build());
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
        MunicipioException generalException = new MunicipioException(e);
        return ResponseEntity.ok(failure(generalException.tratarExcepcion()).build());
    }

}