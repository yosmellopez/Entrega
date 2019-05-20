package cu.ult.entrega.excepcion;

public class BienhechuriaException extends GeneralException {

   public BienhechuriaException (Throwable cause) {
       super(cause);
   }

    @Override
    public String tratarExcepcion() {
        obtenerMensaje();
        if (mensaje.contains("bienhechuria_unica")) {
            return "Ya existe una bienhechuria con ese código.";
        }
        return super.tratarExcepcion();
    }
}
