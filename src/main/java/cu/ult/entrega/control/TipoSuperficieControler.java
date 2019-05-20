/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.TipoSuperficie;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.repositorio.TipoSuperficieRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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

/**
 * @author Pablo Caram Local
 */
@Controller
@RequestMapping("/api")
public class TipoSuperficieControler {

    private final TipoSuperficieRepositorio tipoSuperficieRepositorio;

    @Autowired
    public TipoSuperficieControler(TipoSuperficieRepositorio tipoSuperficieRepositorio) {
        this.tipoSuperficieRepositorio = tipoSuperficieRepositorio;
    }

    @RequestMapping(value = "/tipoSuperficie")
    public ResponseEntity<AppResponse<TipoSuperficie>> listarTipoSuperficie(Pageable p) {
        Page<TipoSuperficie> page = tipoSuperficieRepositorio.findAll(p);
        List<TipoSuperficie> tipoSuperficies = page.getContent();
        return ResponseEntity.ok(success(tipoSuperficies).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/tipoSuperficie/todas")
    public ResponseEntity<AppResponse<TipoSuperficie>> listarTipoSuperficieTodas() {
        List<TipoSuperficie> tipoSuperficies = tipoSuperficieRepositorio.findAll();
        return ResponseEntity.ok(success(tipoSuperficies).total(tipoSuperficies.size()).build());
    }

    @PostMapping(value = "/tipoSuperficie/nueva")
    public ResponseEntity<AppResponse<TipoSuperficie>> insertarTipoSuperficie(@Valid @RequestBody TipoSuperficie tipoSuperficie) {
        tipoSuperficieRepositorio.saveAndFlush(tipoSuperficie);
        return ResponseEntity.ok(success(tipoSuperficie).build());
    }

    @PutMapping(value = "/tipoSuperficie/mod/{id}")
    public ResponseEntity<AppResponse<TipoSuperficie>> actualizarTipoSuperficie(@PathVariable("id") Optional<TipoSuperficie> optional, @Valid @RequestBody TipoSuperficie tipoSuperficie) {
        TipoSuperficie currentTipoSuperficie = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Superficie no encontrada"));
        currentTipoSuperficie.setCodigo(tipoSuperficie.getCodigo());
        currentTipoSuperficie.setNombre(tipoSuperficie.getNombre());
        tipoSuperficieRepositorio.saveAndFlush(currentTipoSuperficie);
        return ResponseEntity.ok(success(currentTipoSuperficie).build());
    }

    @DeleteMapping(value = "/tipoSuperficie/{id}")
    public ResponseEntity<AppResponse> deleteTipoSuperficie(@PathVariable("id") Optional<TipoSuperficie> optional) {
        TipoSuperficie tipoSuperficie = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Superficie no encontrado."));
        tipoSuperficieRepositorio.delete(tipoSuperficie);
        return ResponseEntity.ok(AppResponse.success("Tipo de Superficie eliminada exitosamente.").build());
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