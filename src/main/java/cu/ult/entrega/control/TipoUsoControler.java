/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;
import cu.ult.entrega.clases.ConsejoPopular;
import cu.ult.entrega.clases.Provincia;
import cu.ult.entrega.clases.TipoUso;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.excepcion.ProvinciaException;
import cu.ult.entrega.repositorio.TipoUsoRepositorio;
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
public class TipoUsoControler {

    @Autowired
    TipoUsoRepositorio tipoUsoRepositorio;

    @RequestMapping(value = "/tipoUso")
    public ResponseEntity<AppResponse<TipoUso>> listarTipoUso(Pageable p) {
        Page<TipoUso> page = tipoUsoRepositorio.findAll(p);
        List<TipoUso> tipoUsos = page.getContent();
        return ResponseEntity.ok(success(tipoUsos).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/tipoUso/porNombre/{nombre}")
    public ResponseEntity<AppResponse<TipoUso>> obtenerTipoUsoPorNombre(@PathVariable("nombre") String nombre) {
//        System.out.println(nombre);
        TipoUso tipoUso = tipoUsoRepositorio.findByNombre(nombre);
//        System.out.println(tipoUso);
        return ResponseEntity.ok(success(tipoUso).total(1).build());
    }

    @PostMapping(value = "/tipoUso/nuevo")
    public ResponseEntity<AppResponse<TipoUso>> insertarTipoUso(@Valid @RequestBody TipoUso tipoUso) {
        tipoUsoRepositorio.saveAndFlush(tipoUso);
        return ResponseEntity.ok(success(tipoUso).build());
    }

    @PutMapping(value = "/tipoUso/mod/{id}")
    public ResponseEntity<AppResponse<TipoUso>> actualizarTipoUso(@PathVariable("id") Optional<TipoUso> optional, @Valid @RequestBody TipoUso tipoUso) {
        TipoUso currentTipoUso = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Uso no encontrado"));
        currentTipoUso.setCodigo(tipoUso.getCodigo());
        currentTipoUso.setNombre(tipoUso.getNombre());
        currentTipoUso.setTipoSuperficie(tipoUso.getTipoSuperficie());
        tipoUsoRepositorio.saveAndFlush(currentTipoUso);
        return ResponseEntity.ok(success(currentTipoUso).build());
    }

    @DeleteMapping(value = "/tipoUso/{id}")
    public ResponseEntity<AppResponse> deleteTipoUso(@PathVariable("id") Optional<TipoUso> optional) {
        TipoUso tipoUso = optional.orElseThrow(() -> new EntityNotFoundException("Tipo de Uso no encontrado."));
        tipoUsoRepositorio.delete(tipoUso);
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

