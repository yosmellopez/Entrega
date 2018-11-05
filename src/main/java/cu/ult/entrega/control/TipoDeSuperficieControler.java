/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.TipoDeSuperficie;
import cu.ult.entrega.repositorio.TipoDeSuperficieRepositorio;

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

/**
 * @author Pablo Caram Local
 */
@Controller
public class TipoDeSuperficieControler {

    @Autowired
    TipoDeSuperficieRepositorio tipoDeSuperficieRepositorio;

    @RequestMapping(value = "/tipoDeSuperficie/")
    public ModelAndView listarTipoDeSuperficies(ModelMap map) {
        List<TipoDeSuperficie> tipoDeSuperficies = tipoDeSuperficieRepositorio.findAll();
        map.put("tipoDeSuperficies", tipoDeSuperficies);
        map.put("cant", tipoDeSuperficies.size());

        if (tipoDeSuperficies.isEmpty()) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/tipoDeSuperficie/nueva/", method = RequestMethod.POST)
    public ResponseEntity<TipoDeSuperficie> insertarTipoDeSuperficie(@RequestBody TipoDeSuperficie tipoDeSuperficie) {
        tipoDeSuperficieRepositorio.saveAndFlush(tipoDeSuperficie);
        return ResponseEntity.ok(tipoDeSuperficie);
    }

    @RequestMapping(value = "/tipoDeSuperficie/{id}", method = RequestMethod.PUT)
    public ResponseEntity<TipoDeSuperficie> updateUser(@PathVariable("id") long id, @RequestBody TipoDeSuperficie tipoDeSuperficie) {
        System.out.println("Updating User " + id);
        TipoDeSuperficie currentTipoDeSuperficie = tipoDeSuperficieRepositorio.findById(id).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
        currentTipoDeSuperficie.setCodigo(tipoDeSuperficie.getCodigo());
        currentTipoDeSuperficie.setNombre(tipoDeSuperficie.getNombre());
        tipoDeSuperficieRepositorio.saveAndFlush(currentTipoDeSuperficie);
        return new ResponseEntity<TipoDeSuperficie>(currentTipoDeSuperficie, HttpStatus.OK);
    }

    @RequestMapping(value = "/tipoDeSuperficie/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<TipoDeSuperficie> deleteTipoDeSuperficie(@PathVariable("id") long id) {
        TipoDeSuperficie tipoDeSuperficie = tipoDeSuperficieRepositorio.findById(id).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
        tipoDeSuperficieRepositorio.deleteById(id);
        return new ResponseEntity<TipoDeSuperficie>(HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorTipoDeSuperficie> mostrarError(Exception e) {
        String mensaje = e.getLocalizedMessage();

        if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        }
        if (mensaje.contains("tipoDeSuperficie_unico")) {
            mensaje = "No se puede insertar el tipo de superficie porque ya existe";
        }
        ErrorTipoDeSuperficie error = new ErrorTipoDeSuperficie(false, mensaje);
        return ResponseEntity.ok(error);
    }

}

final class ErrorTipoDeSuperficie {

    private boolean success;

    private String mensaje;

    public ErrorTipoDeSuperficie(boolean success, String mensaje) {
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