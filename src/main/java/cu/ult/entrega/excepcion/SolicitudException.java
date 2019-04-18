package cu.ult.entrega.excepcion;

public class SolicitudException extends GeneralException {

    public SolicitudException(Throwable cause) {
        super(cause);
    }

    @Override
    public String tratarExcepcion() {
        obtenerMensaje();
        if (mensaje.contains("solicitud_unica")){
            return "Ya exise una solicitud con ese numero de expediente.";
        }

        if (mensaje.contains("persona_unica")) {
            return "Ya exise una persona con ese Carnet de Identidad.";
        }


        return super.tratarExcepcion();
    }
}
