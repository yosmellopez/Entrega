package cu.ult.entrega.control;

import cu.ult.entrega.clases.Bienhechuria;
import cu.ult.entrega.clases.Persona;
import cu.ult.entrega.clases.Regulaciones;
import cu.ult.entrega.clases.Solicitud;
import cu.ult.entrega.repositorio.BienhechuriaRepositorio;
import cu.ult.entrega.repositorio.SolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static cu.ult.entrega.control.AppResponse.success;

@RestController
@RequestMapping("/api")
public class TramiteControler {

    @Autowired
    SolicitudRepositorio solicitudRepositorio;

    @RequestMapping(value = "/tramite/investi")
    public ResponseEntity<AppResponse<Regulaciones>> listarbienhechuria() {

        List<Solicitud> regulaciones = solicitudRepositorio.findByTipoSolicitudAndTramite_FechaEntreInvestig("Ampliacion",null);
        return ResponseEntity.ok(success(regulaciones).total(regulaciones.size()).build());
    }


}
