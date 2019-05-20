package cu.ult.entrega.control;

import cu.ult.entrega.clases.Regulaciones;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.repositorio.RegulacionRepositorio;
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

@RestController
@RequestMapping("/api")
public class RegulacionControler {

    @Autowired
    RegulacionRepositorio regulacionRepositorio;

    @RequestMapping(value = "/regulacion")
    public ResponseEntity<AppResponse<Regulaciones>> listarRegulacion(Pageable p) {
        Page<Regulaciones> page = regulacionRepositorio.findAll(p);
        List<Regulaciones> regulacion = page.getContent();
        return ResponseEntity.ok(success(regulacion).total(page.getTotalElements()).build());
    }

    @PostMapping(value = "/regulacion")
    public ResponseEntity<AppResponse<Regulaciones>> insertarRegulacion(@Valid @RequestBody Regulaciones regulacion) {
        regulacionRepositorio.saveAndFlush(regulacion);
        return ResponseEntity.ok(success(regulacion).build());
    }

    @PutMapping(value = "/regulacion/{id}")
    public ResponseEntity<AppResponse<Regulaciones>> actualizarRegulacion(@PathVariable("id") Optional<Regulaciones> optional, @Valid @RequestBody Regulaciones regulacion) {
        Regulaciones currentregulacion = optional.orElseThrow(() -> new EntityNotFoundException("regulacion no encontrada"));
        currentregulacion.setRegulacion(regulacion.getRegulacion());
        regulacionRepositorio.saveAndFlush(currentregulacion);
        return ResponseEntity.ok(success(currentregulacion).build());
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
