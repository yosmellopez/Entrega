/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;
import cu.ult.entrega.clases.Provincia;
import cu.ult.entrega.clases.TipoDeUso;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.excepcion.ProvinciaException;
import cu.ult.entrega.repositorio.TipoDeUsoRepositorio;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
import static cu.ult.entrega.control.AppResponse.failure;
import static cu.ult.entrega.control.AppResponse.success;


@Controller
@RequestMapping("/api")
public class TipoDeUsoControler {

    @Autowired
    TipoDeUsoRepositorio tipoDeUsoRepositorio;

    @RequestMapping(value = "/tipoDeUso")
    public ResponseEntity<AppResponse<TipoDeUso>> listarTipoDeUso(Pageable p) {
        Page<TipoDeUso> page = tipoDeUsoRepositorio.findAll(p);
        List<TipoDeUso> tipoDeUsos = page.getContent();
        return ResponseEntity.ok(success(tipoDeUsos).total(page.getTotalElements()).build());
    }

    @PostMapping(value = "/tipoDeUso/nuevo")
    public ResponseEntity<AppResponse<TipoDeUso>> insertarTipoDeUso(@Valid @RequestBody TipoDeUso tipoDeUso) {
        tipoDeUsoRepositorio.saveAndFlush(tipoDeUso);
        return ResponseEntity.ok(success(tipoDeUso).build());
    }

    @PutMapping(value = "/tipoDeUso/mod/{id}")
    public ResponseEntity<AppResponse<TipoDeUso>> actualizarTipoDeUso(@PathVariable("id") Optional<TipoDeUso> optional, @Valid @RequestBody TipoDeUso tipoDeUso) {
        TipoDeUso currentTipoDeUso = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Uso no encontrado"));
        currentTipoDeUso.setCodigo(tipoDeUso.getCodigo());
        currentTipoDeUso.setNombre(tipoDeUso.getNombre());
        currentTipoDeUso.setTipoDeSuperficie(tipoDeUso.getTipoDeSuperficie());
        tipoDeUsoRepositorio.saveAndFlush(currentTipoDeUso);
        return ResponseEntity.ok(success(currentTipoDeUso).build());
    }

    @DeleteMapping(value = "/tipoDeUso/{id}")
    public ResponseEntity<AppResponse> deleteTipoDeUso(@PathVariable("id") Optional<TipoDeUso> optional) {
        TipoDeUso tipoDeUso = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Uso no encontrado."));
        tipoDeUsoRepositorio.delete(tipoDeUso);
        return ResponseEntity.ok(AppResponse.success("Tipo de Uso eliminado exitosamente.").build());
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

