/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.control;

import cu.ult.entrega.clases.Parcela;
import cu.ult.entrega.clases.Solicitud;
import cu.ult.entrega.repositorio.ParcelaRepositorio;
import cu.ult.entrega.repositorio.SolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.List;


/**
 * @author Pablo Caram Local
 */
@RestController
public class ParcelaControler {

    @Autowired
    ParcelaRepositorio parcelaRepositorio;

    @Autowired
    SolicitudRepositorio solicitudRepositorio;

    @GetMapping(value = "/parcela")
    public ResponseEntity<AppResponse<Parcela>> listarParcela() {
        List<Parcela> parcelas = parcelaRepositorio.findAll();
        return ResponseEntity.ok(AppResponse.success(parcelas).total(parcelas.size()).build());
    }

    @RequestMapping(value = "/parcela/nueva/{idSolicitud}", method = RequestMethod.POST)
    public ResponseEntity<Parcela> insertarParcela(@PathVariable("idSolicitud") Long idSolicitud, @RequestBody Parcela parcela) {
        System.out.println("Updating User " + parcela);
        Solicitud solicitud = solicitudRepositorio.findById(idSolicitud).orElseThrow(() -> new EntityNotFoundException("No se encuentra esta entidad"));
        parcela.setSolicitudes((List<Solicitud>) solicitud);
        parcelaRepositorio.saveAndFlush(parcela);
        return ResponseEntity.ok(parcela);
    }


}
