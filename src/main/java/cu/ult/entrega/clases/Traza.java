package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import cu.ult.entrega.util.SerializadorFechaTraza;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "traza")
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler", "objeto"}, ignoreUnknown = true)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Traza implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_traza", nullable = false)
    private Integer idTraza;

    @Column(name = "url", length = 300)
    private String url;

    @Column(name = "tiempo")
    @Temporal(TemporalType.TIMESTAMP)
    @JsonSerialize(using = SerializadorFechaTraza.class)
    private Date tiempo;

    @Column(name = "accion", length = 500)
    private String accion;

    @Column(name = "ip", length = 500)
    private String ip;

    @ManyToOne
    @JoinColumn(name = "id_usuario", foreignKey = @ForeignKey(name = "fk_id_usuario"))
    private Usuario usuario;

    public Traza() {
    }

    public Traza(String url, Date tiempo, String accion, Usuario usuario) {
        this.url = url;
        this.tiempo = tiempo;
        this.accion = accion;
        this.usuario = usuario;
    }

    public Traza(Integer idTraza) {
        this.idTraza = idTraza;
    }

    public Integer getIdTraza() {
        return idTraza;
    }

    public void setIdTraza(Integer idTraza) {
        this.idTraza = idTraza;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Date getTiempo() {
        return tiempo;
    }

    public void setTiempo(Date tiempo) {
        this.tiempo = tiempo;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

}
