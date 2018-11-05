package cu.ult.entrega.excepcion;

public class ProvinciaException extends GeneralException {

    public ProvinciaException(Throwable cause) {
        super(cause);
    }

    @Override
    public String tratarExcepcion() {
        obtenerMensaje();
        if (mensaje.contains("provincia_codigo_unico")) {
            return "Ya exise una provincia con ese codigo.";
        }
        if (mensaje.contains("provincia_nombre_unico")) {
            return "Ya exise una provincia con ese nombre.";
        }
        if (mensaje.contains("fk_municipio_provincia")) {
            return "No se puede eliminar esta provincia porque contiene municipios.";
        }
        return super.tratarExcepcion();
    }
}
