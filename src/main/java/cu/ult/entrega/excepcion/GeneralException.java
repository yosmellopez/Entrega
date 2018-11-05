package cu.ult.entrega.excepcion;

import org.hibernate.exception.SQLGrammarException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.jpa.JpaSystemException;

import javax.persistence.PersistenceException;

public class GeneralException extends Exception {

    protected String mensaje;

    public GeneralException(String message) {
        super(message);
        this.mensaje = message;
    }

    public GeneralException(Throwable cause) {
        super(cause);
    }

    public void obtenerMensaje() {
        Throwable e = getCause();
        if (e instanceof JpaSystemException) {
            JpaSystemException jse = (JpaSystemException) e;
            mensaje = jse.getMostSpecificCause().getLocalizedMessage();
        } else if (e instanceof PersistenceException) {
            JpaSystemException exception = new JpaSystemException((PersistenceException) e);
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        } else if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            mensaje = exception.getMostSpecificCause().getLocalizedMessage();
        } else if (e instanceof SQLGrammarException) {
            SQLGrammarException exception = (SQLGrammarException) e;
            mensaje = exception.getCause().getLocalizedMessage();
        } else {
            mensaje = e.getLocalizedMessage();
        }
    }

    public String tratarExcepcion() {
        obtenerMensaje();
        return mensaje;
    }

}
