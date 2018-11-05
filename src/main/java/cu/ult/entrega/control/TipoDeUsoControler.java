/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.TipoDeSuperficie;
import cu.ult.entrega.clases.TipoDeUso;
import cu.ult.entrega.repositorio.TipoDeSuperficieRepositorio;
import cu.ult.entrega.repositorio.TipoDeUsoRepositorio;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.persistence.EntityNotFoundException;


@Controller
public class TipoDeUsoControler {

    @Autowired
    TipoDeUsoRepositorio tipoDeUsoRepositorio;

    @Autowired
    TipoDeSuperficieRepositorio tipoDeSuperficieRepositorio;

    @RequestMapping(value = "/tipoDeUso/list/")
    public ModelAndView listarTipoDeUsos(ModelMap map) {
        List<TipoDeUso> tipoDeUsos = tipoDeUsoRepositorio.findAll();
        map.put("tipoDeUsos", tipoDeUsos);
        map.put("cant", tipoDeUsos.size());

        if (tipoDeUsos.isEmpty()) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/tipoDeUso/list/porTS/{idTS}")
    public ModelAndView listarTipoDeUsosPorTS(@PathVariable("idTS") Long idTS, ModelMap map) {

        TipoDeSuperficie tipoDeSuperficie = tipoDeSuperficieRepositorio.findById(idTS).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));

        if (tipoDeSuperficie == null) {
            map.put("response", HttpStatus.NOT_FOUND);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        List<TipoDeUso> tipoDeUsos = tipoDeUsoRepositorio.findByTipoDeSuperficie(tipoDeSuperficie);
        map.put("tipoDeUsos", tipoDeUsos);
        map.put("cant", tipoDeUsos.size());

        if (tipoDeUsos.isEmpty()) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/tipoDeUso/nueva/", method = RequestMethod.POST)
    public ResponseEntity<TipoDeUso> insertarTipoDeUso(@RequestBody TipoDeUso tipoDeUso) {
        tipoDeUsoRepositorio.saveAndFlush(tipoDeUso);
        return ResponseEntity.ok(tipoDeUso);
    }

    @RequestMapping(value = "/tipoDeUso/{id}", method = RequestMethod.PUT)
    public ResponseEntity<TipoDeUso> actualizarTipoDeUso(@PathVariable("id") Long id, @RequestBody TipoDeUso tipoDeUso) {
        System.out.println("Updating User " + id);

        TipoDeUso currentTipoDeUso = tipoDeUsoRepositorio.findById(id).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));

        currentTipoDeUso.setCodigo(tipoDeUso.getCodigo());
        currentTipoDeUso.setNombre(tipoDeUso.getNombre());
        currentTipoDeUso.setTipoDeSuperficie(tipoDeUso.getTipoDeSuperficie());

        tipoDeUsoRepositorio.saveAndFlush(currentTipoDeUso);
        return new ResponseEntity<TipoDeUso>(currentTipoDeUso, HttpStatus.OK);
    }

    @RequestMapping(value = "/tipoDeUso/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<TipoDeUso> deleteTipoDeUso(@PathVariable("id") Long id) {
        System.out.println("Fetching & Deleting User with id " + id);
        TipoDeUso tipoDeUso = tipoDeUsoRepositorio.findById(id).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
        tipoDeUsoRepositorio.deleteById(id);
        return new ResponseEntity<TipoDeUso>(HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorTipoDeSuperficie> mostrarError(Exception e) {
        String mensaje = e.getLocalizedMessage();

        if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        }
        if (mensaje.contains("tipoDeSuperficie_unico")) {
            mensaje = "No se puede insertar el tipo de uso porque ya existe";
        }
        ErrorTipoDeSuperficie error = new ErrorTipoDeSuperficie(false, mensaje);
        return ResponseEntity.ok(error);
    }

}

final class ErrorTipoDeUso {

    private boolean success;

    private String mensaje;

    public ErrorTipoDeUso(boolean success, String mensaje) {
        this.success = success;
        this.mensaje = mensaje;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

}

