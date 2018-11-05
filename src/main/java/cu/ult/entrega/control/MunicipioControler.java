/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Municipio;
import cu.ult.entrega.repositorio.MunicipioRepositorio;
import cu.ult.entrega.repositorio.ProvinciaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;


@Controller
public class MunicipioControler {

    @Autowired
    MunicipioRepositorio municipioRepositorio;

    @Autowired
    ProvinciaRepositorio provinciaRepositorio;

    @RequestMapping(value = "/municipio/")
    public ModelAndView listarMunicipios(ModelMap map) {
        List<Municipio> municipios = municipioRepositorio.findAll();
        map.put("municipios", municipios);
        map.put("cant", municipios.size());

        if (municipios.isEmpty()) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    /**
     * @param municipio
     * @param result
     * @return
     */
    @RequestMapping(value = "/municipio/nuevo", method = RequestMethod.POST)
    public ResponseEntity<Municipio> insertarMunicipio(@RequestBody Municipio municipio, BindingResult result) {
        municipioRepositorio.saveAndFlush(municipio);
        return ResponseEntity.ok(municipio);
    }

    @PutMapping(value = "/municipio/{id}")
    public ResponseEntity<Municipio> updateMunicipio(@PathVariable("id") Optional<Municipio> optional, @RequestBody Municipio municipio) {
        Municipio currentMunicipio = optional.orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
        currentMunicipio.setCodigo(municipio.getCodigo());
        currentMunicipio.setNombre(municipio.getNombre());
        currentMunicipio.setProvincia(municipio.getProvincia());

        municipioRepositorio.saveAndFlush(currentMunicipio);
        return new ResponseEntity<Municipio>(currentMunicipio, HttpStatus.OK);
    }

    @RequestMapping(value = "/municipio/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Municipio> deleteMunicipio(@PathVariable("id") long id) {
        System.out.println("Fetching & Deleting User with id " + id);

        Municipio municipio = municipioRepositorio.findById(id).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
        if (municipio == null) {
            System.out.println("Unable to delete. User with id " + id + " not found");
            return new ResponseEntity<Municipio>(HttpStatus.NOT_FOUND);
        }

        municipioRepositorio.deleteById(id);
        return new ResponseEntity<Municipio>(HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMuni> mostrarError(Exception e) {
        String mensaje = e.getLocalizedMessage();

        if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        }
        if (mensaje.contains("municipio_unico")) {
            mensaje = "No se puede insertar este municipio porque ya existe";
        }
        ErrorMuni errorm = new ErrorMuni(false, mensaje);
        return ResponseEntity.ok(errorm);
    }

}

final class ErrorMuni {

    private boolean success;

    private String mensaje;

    public ErrorMuni(boolean success, String mensaje) {
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
