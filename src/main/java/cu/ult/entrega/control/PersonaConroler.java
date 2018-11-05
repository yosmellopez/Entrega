/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Persona;
import cu.ult.entrega.clases.Solicitud;
import cu.ult.entrega.repositorio.PersonaRepositorio;
import cu.ult.entrega.repositorio.SolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.persistence.EntityNotFoundException;
import java.util.List;

/**
 * @author Pablo Caram Local
 */
@Controller
public class PersonaConroler {

    @Autowired
    PersonaRepositorio personaRepositorio;

    @Autowired
    SolicitudRepositorio solicitudRepositorio;

    @RequestMapping(value = "/persona")
    public ModelAndView listarPersonas(ModelMap map) {
        List<Persona> personas = personaRepositorio.findAll();
        map.put("personas", personas);
        map.put("cant", personas.size());

        if (personas.isEmpty()) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/persona/CI")
    public ModelAndView ObtenerPersonas(@PathVariable("ci") String ci, ModelMap map) {
        Persona persona = personaRepositorio.findByCi(ci);
        map.put("persona", persona);

        if (persona == null) {
            map.put("response", HttpStatus.NO_CONTENT);
            return new ModelAndView(new MappingJackson2JsonView(), map);
        }

        map.put("response", HttpStatus.OK);
        return new ModelAndView(new MappingJackson2JsonView(), map);
    }

    @RequestMapping(value = "/persona/nueva/{idSoli}", method = RequestMethod.POST)
    public ResponseEntity<Persona> insertarMunicipio(@PathVariable("idSoli") long idSoli, @RequestBody Persona persona, BindingResult result) {
        personaRepositorio.saveAndFlush(persona);

        if (idSoli != -1) {
            Solicitud solicitud = solicitudRepositorio.findById(idSoli).orElseThrow(() -> new EntityNotFoundException("Municipio no encontrado"));
            solicitud.setPersona(persona);
            solicitudRepositorio.saveAndFlush(solicitud);
        }

        return ResponseEntity.ok(persona);
    }

}
