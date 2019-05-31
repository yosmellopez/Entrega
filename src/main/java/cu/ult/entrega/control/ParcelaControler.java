/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Bienhechuria;
import cu.ult.entrega.clases.Parcela;
import cu.ult.entrega.clases.Solicitud;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.repositorio.ParcelaRepositorio;
import cu.ult.entrega.repositorio.SolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


/**
 * @author Pablo Caram Local
 */
@RestController
@RequestMapping("/api")
public class ParcelaControler {

    @Autowired
    ParcelaRepositorio parcelaRepositorio;

    @Autowired
    SolicitudRepositorio solicitudRepositorio;

    @RequestMapping(value = "/parcela")
    public ResponseEntity<AppResponse<Parcela>> listarParcela(Pageable p) {
        Page<Parcela> page = parcelaRepositorio.findAll(p);
        List<Parcela> parcelas = page.getContent();
        return ResponseEntity.ok(success(parcelas).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/parcela/todas")
    public ResponseEntity<AppResponse<Parcela>> listarAllParcela() {
        List<Parcela> parcelas = parcelaRepositorio.findAll();
        return ResponseEntity.ok(success(parcelas).total(parcelas.size()).build());
    }
    @RequestMapping(value = "/parcela/{zc}{parcela}{divicion}")
    public ResponseEntity<AppResponse<Parcela>> listarAllParcela(@PathVariable("zc") Integer zc, @PathVariable("parcela") Integer parcela, @PathVariable("divicion") Integer divicion) {
        Parcela parcela1 = parcelaRepositorio.findByZonaCatastralAndParcelaAndDivicion(zc, parcela, divicion);
        return ResponseEntity.ok(success(parcela1).build());
    }

    @PostMapping(value = "/parcela")
    public ResponseEntity<AppResponse<Parcela>> insertarParcela(@Valid @RequestBody Parcela parcela) {
        parcelaRepositorio.saveAndFlush(parcela);
        return ResponseEntity.ok(success(parcela).build());
    }

    @PutMapping(value = "/parcela/{id}")
    public ResponseEntity<AppResponse<Parcela>> actualizarParcela(@PathVariable("id") Optional<Parcela> optional, @Valid @RequestBody Parcela parcela) {
        Parcela currentParcela = optional.orElseThrow(() -> new EntityNotFoundException("Parcela no encontrada"));

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

        return ResponseEntity.ok(success(currentParcela).build());
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
