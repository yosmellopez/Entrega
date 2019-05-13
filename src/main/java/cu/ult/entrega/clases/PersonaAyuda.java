package cu.ult.entrega.clases;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "personaAyuda", uniqueConstraints = @UniqueConstraint(name = "persona_unica", columnNames = {"ci"}))
public class PersonaAyuda implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ci")
    private String ci;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "primerApellido")
    private String primerApellido;

    @Column(name = "segundoApellido")
    private String segundoApellido;

    @Column(name = "parentesco")
    private String parentesco;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_personaAyuda_asociado"))
    private Persona asociado;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCi() {
        return ci;
    }

    public void setCi(String ci) {
        this.ci = ci;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public String getParentesco() {
        return parentesco;
    }

    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }

    public Persona getAsociado() {
        return asociado;
    }

    public void setAsociado(Persona asociado) {
        this.asociado = asociado;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PersonaAyuda)) return false;
        PersonaAyuda that = (PersonaAyuda) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getCi(), that.getCi()) &&
                Objects.equals(getNombre(), that.getNombre()) &&
                Objects.equals(getPrimerApellido(), that.getPrimerApellido()) &&
                Objects.equals(getSegundoApellido(), that.getSegundoApellido()) &&
                Objects.equals(getParentesco(), that.getParentesco()) &&
                Objects.equals(getAsociado(), that.getAsociado());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getId(), getCi(), getNombre(), getPrimerApellido(), getSegundoApellido(), getParentesco(), getAsociado());
    }

    @Override
    public String toString() {
        return "PersonaAyuda{" +
                "id=" + id +
                ", ci='" + ci + '\'' +
                ", nombre='" + nombre + '\'' +
                ", primerApellido='" + primerApellido + '\'' +
                ", segundoApellido='" + segundoApellido + '\'' +
                ", parentesco='" + parentesco + '\'' +
                ", asociado=" + asociado +
                '}';
    }
}
