package cu.ult.entrega.control;


import cu.ult.entrega.clases.Bienhechuria;
import cu.ult.entrega.clases.Municipio;
import cu.ult.entrega.clases.Provincia;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.repositorio.BienhechuriaRepositorio;
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
public class BienhechuriaControler {

    @Autowired
    BienhechuriaRepositorio bienhechuriaRepositorio;

    @RequestMapping(value = "/bienhechuria")
    public ResponseEntity<AppResponse<Bienhechuria>> listarbienhechuria(Pageable p) {
        Page<Bienhechuria> page = bienhechuriaRepositorio.findAll(p);
        List<Bienhechuria> bienhechuria = page.getContent();
        return ResponseEntity.ok(success(bienhechuria).total(page.getTotalElements()).build());
    }

    @PostMapping(value = "/bienhechuria")
    public ResponseEntity<AppResponse<Bienhechuria>> insertarBienhechuria(@Valid @RequestBody Bienhechuria bienhechuria) {
        bienhechuriaRepositorio.saveAndFlush(bienhechuria);
        return ResponseEntity.ok(success(bienhechuria).build());
    }

    @PutMapping(value = "/bienhechuria/{id}")
    public ResponseEntity<AppResponse<Bienhechuria>> actualizarBienhechuria(@PathVariable("id") Optional<Bienhechuria> optional, @Valid @RequestBody Bienhechuria bienhechuria) {
        Bienhechuria currentBienhechuria = optional.orElseThrow(() -> new EntityNotFoundException("bienhechuria no encontrada"));
        currentBienhechuria.setNombre(bienhechuria.getNombre());
        bienhechuriaRepositorio.saveAndFlush(currentBienhechuria);
        return ResponseEntity.ok(success(currentBienhechuria).build());
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
