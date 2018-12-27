package cu.ult.entrega.control;


import cu.ult.entrega.clases.ConsejoPopular;
import cu.ult.entrega.clases.Municipio;
import cu.ult.entrega.excepcion.MunicipioException;
import cu.ult.entrega.repositorio.ConsejoPopularRepositorio;
import cu.ult.entrega.repositorio.MunicipioRepositorio;
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
@RequestMapping ("/api")
public class ConsjoPopularControler {

    @Autowired
    ConsejoPopularRepositorio consejoPopularRepositorio;

    @RequestMapping(value = "/consejoPopular")
    public ResponseEntity<AppResponse<ConsejoPopular>> listarConsejoPopular(Pageable p) {
        Page<ConsejoPopular> page = consejoPopularRepositorio.findAll(p);
        List<ConsejoPopular> consejoPopulars = page.getContent();
        return ResponseEntity.ok(success(consejoPopulars).total(page.getTotalElements()).build());
    }

    @RequestMapping(value = "/consejoPopular/todos")
    public ResponseEntity<AppResponse<ConsejoPopular>> listarTodosConsejoPopular() {
        List<ConsejoPopular> consejoPopulars = consejoPopularRepositorio.findAll();
        return ResponseEntity.ok(success(consejoPopulars).total(consejoPopulars.size()).build());
    }

    @RequestMapping(value = "/consejoPopular/porNombre/{nombre}")
    public ResponseEntity<AppResponse<ConsejoPopular>> ObtenerConsejoPopularPorNombre(@PathVariable("nombre") String nombre) {
        ConsejoPopular consejoPopular = consejoPopularRepositorio.findByNombre(nombre);
        return ResponseEntity.ok(success(consejoPopular).total(1).build());
    }

    @PostMapping(value = "/consejoPopular/nuevo")
    public ResponseEntity<AppResponse<ConsejoPopular>> insertarConsejoPopular(@Valid @RequestBody ConsejoPopular consejoPopular) {
        consejoPopularRepositorio.saveAndFlush(consejoPopular);
        return ResponseEntity.ok(success(consejoPopular).build());
    }

    @PutMapping(value = "/consejoPopular/mod/{id}")
    public ResponseEntity<AppResponse<ConsejoPopular>> actualizarConsejoPopular(@PathVariable("id") Optional<ConsejoPopular> optional, @Valid @RequestBody ConsejoPopular consejoPopular) {
        ConsejoPopular currentConsejoPopular = optional.orElseThrow(() -> new EntityNotFoundException("Consejo popular no encontrado."));
        currentConsejoPopular.setCodigo(consejoPopular.getCodigo());
        currentConsejoPopular.setNombre(consejoPopular.getNombre());
        currentConsejoPopular.setMunicipio(consejoPopular.getMunicipio());
        consejoPopularRepositorio.saveAndFlush(currentConsejoPopular);
        return ResponseEntity.ok(success(consejoPopular).build());
    }

    @DeleteMapping(value = "/consejoPopular/{id}")
    public ResponseEntity<AppResponse> deleteConsejoPopular(@PathVariable("id") Optional<ConsejoPopular> optional) {
        ConsejoPopular consejoPopular = optional.orElseThrow(() -> new EntityNotFoundException("Consejo popular no encontrada."));
        consejoPopularRepositorio.delete(consejoPopular);
        return ResponseEntity.ok(AppResponse.success("Consejo popular eliminado exitosamente.").build());
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
