package cu.ult.entrega.control;

import cu.ult.entrega.repositorio.SolicitudRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ReporteControler {

    @Autowired
    private SolicitudRepositorio solicitudRepositorio;

    @RequestMapping(value = "/reporteConcilMedicion", method = {RequestMethod.GET, RequestMethod.POST})
    public ModelAndView investigacion()  {

        ModelMap map = new ModelMap();
        map.put("datasource", solicitudRepositorio.findAll());
        map.put("format", "pdf");
        return new ModelAndView("reporteConcilMedicion", map);

    }
}
