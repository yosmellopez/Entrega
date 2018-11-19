/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Provincia;
import cu.ult.entrega.clases.TipoDeSuperficie;
import cu.ult.entrega.clases.TipoDeUso;
import cu.ult.entrega.excepcion.ProvinciaException;
import cu.ult.entrega.repositorio.TipoDeSuperficieRepositorio;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;

import static cu.ult.entrega.control.AppResponse.failure;
import static cu.ult.entrega.control.AppResponse.success;

/**
 * @author Pablo Caram Local
 */
@Controller
@RequestMapping("/api")
public class TipoDeSuperficieControler {

    @Autowired
    TipoDeSuperficieRepositorio tipoDeSuperficieRepositorio;

    @RequestMapping(value = "/tipoDeSuperficie")
    public ResponseEntity<AppResponse<TipoDeSuperficie>> listarTipoDeSuperficie(Pageable p) {
        Page<TipoDeSuperficie> page = tipoDeSuperficieRepositorio.findAll(p);
        List<TipoDeSuperficie> tipoDeSuperficies = page.getContent();
        return ResponseEntity.ok(success(tipoDeSuperficies).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/tipoDeSuperficie/todas")
    public ResponseEntity<AppResponse<TipoDeSuperficie>> listarTipoDeSuperficieTodas() {
        List<TipoDeSuperficie> tipoDeSuperficies = tipoDeSuperficieRepositorio.findAll();
        return ResponseEntity.ok(success(tipoDeSuperficies).total(tipoDeSuperficies.size()).build());
    }

    @PostMapping(value = "/tipoDeSuperficie/nueva")
    public ResponseEntity<AppResponse<TipoDeSuperficie>> insertarTipoDeSuperficie(@Valid @RequestBody TipoDeSuperficie tipoDeSuperficie) {
        tipoDeSuperficieRepositorio.saveAndFlush(tipoDeSuperficie);
        return ResponseEntity.ok(success(tipoDeSuperficie).build());
    }

    @PutMapping(value = "/tipoDeSuperficie/mod/{id}")
    public ResponseEntity<AppResponse<TipoDeSuperficie>> actualizarTipoDeSuperficie(@PathVariable("id") Optional<TipoDeSuperficie> optional, @Valid @RequestBody TipoDeSuperficie tipoDeSuperficie) {
        TipoDeSuperficie currentTipoDeSuperficie = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Superficie no encontrada"));
        currentTipoDeSuperficie.setCodigo(tipoDeSuperficie.getCodigo());
        currentTipoDeSuperficie.setNombre(tipoDeSuperficie.getNombre());
        tipoDeSuperficieRepositorio.saveAndFlush(currentTipoDeSuperficie);
        return ResponseEntity.ok(success(currentTipoDeSuperficie).build());
    }

    @DeleteMapping(value = "/tipoDeSuperficie/{id}")
    public ResponseEntity<AppResponse> deleteTipoDeSuperficie(@PathVariable("id") Optional<TipoDeSuperficie> optional) {
        TipoDeSuperficie tipoDeSuperficie = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Superficie no encontrado."));
        tipoDeSuperficieRepositorio.delete(tipoDeSuperficie);
        return ResponseEntity.ok(AppResponse.success("Tipo de Superficie eliminada exitosamente.").build());
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