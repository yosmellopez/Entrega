package cu.ult.entrega.clases;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "persona_parcela")
public class PersonaParcela implements Serializable {

    @EmbeddedId
    PersonaParcelaPK personaParcelaPK;

    @ManyToOne(optional = false)
    @JoinColumn(name = "parcela_id", foreignKey = @ForeignKey(name = "fk_parcela_persona"), insertable = false, updatable = false)
    private Parcela parcela;

    @ManyToOne(optional = false)
    @JoinColumn(name = "persona_id", foreignKey = @ForeignKey(name = "fk_persona_parcela"), insertable = false, updatable = false)
    private Persona persona;

    @Column(name = "fechaAlta")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date fechaAlta;

    @Column(name = "tipoDeTenencia")
    private String tipoDeTenencia;

    @Column(name = "fechaBaja")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date fechaBaja;

    @Column(name = "detallesBaja")
    private String detallesBaja;

    @Column(name = "gradoDeExplotacion")
    private char gradoDeExplotacion;

    @Column(name = "noCertTenInscrito")
    private Integer noCertTenInscrito;

    @Column (name = "cultOActivAgroDediAct")
    private String cultOActivAgroDediAct;

    @Column (name = "areaVacia")
    private float areaVacia;

    @Column (name = "existirCausas")
    private String existirCausas;

    public PersonaParcela() {
    }

    public PersonaParcela(PersonaParcelaPK personaParcelaPK) {
        this.personaParcelaPK = personaParcelaPK;
    }

    public PersonaParcelaPK getPersonaParcelaPK() {
        return personaParcelaPK;
    }

    public void setPersonaParcelaPK(PersonaParcelaPK personaParcelaPK) {
        this.personaParcelaPK = personaParcelaPK;
    }

    public Parcela getParcela() {
        return parcela;
    }

    public void setParcela(Parcela parcela) {
        this.parcela = parcela;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Date getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(Date fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public String getTipoDeTenencia() {
        return tipoDeTenencia;
    }

    public void setTipoDeTenencia(String tipoDeTenencia) {
        this.tipoDeTenencia = tipoDeTenencia;
    }

    public Date getFechaBaja() {
        return fechaBaja;
    }

    public void setFechaBaja(Date fechaBaja) {
        this.fechaBaja = fechaBaja;
    }

    public String getDetallesBaja() {
        return detallesBaja;
    }

    public void setDetallesBaja(String detallesBaja) {
        this.detallesBaja = detallesBaja;
    }

    public char getGradoDeExplotacion() {
        return gradoDeExplotacion;
    }

    public void setGradoDeExplotacion(char gradoDeExplotacion) {
        this.gradoDeExplotacion = gradoDeExplotacion;
    }

    public Integer getNoCertTenInscrito() {
        return noCertTenInscrito;
    }

    public void setNoCertTenInscrito(Integer noCertTenInscrito) {
        this.noCertTenInscrito = noCertTenInscrito;
    }

    public String getCultOActivAgroDediAct() {
        return cultOActivAgroDediAct;
    }

    public void setCultOActivAgroDediAct(String cultOActivAgroDediAct) {
        this.cultOActivAgroDediAct = cultOActivAgroDediAct;
    }

    public float getAreaVacia() {
        return areaVacia;
    }

    public void setAreaVacia(float areaVacia) {
        this.areaVacia = areaVacia;
    }

    public String getExistirCausas() {
        return existirCausas;
    }

    public void setExistirCausas(String existirCausas) {
        this.existirCausas = existirCausas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PersonaParcela)) return false;
        PersonaParcela that = (PersonaParcela) o;
        return getGradoDeExplotacion() == that.getGradoDeExplotacion() &&
                Float.compare(that.getAreaVacia(), getAreaVacia()) == 0 &&
                Objects.equals(getPersonaParcelaPK(), that.getPersonaParcelaPK()) &&
                Objects.equals(getParcela(), that.getParcela()) &&
                Objects.equals(getPersona(), that.getPersona()) &&
                Objects.equals(getFechaAlta(), that.getFechaAlta()) &&
                Objects.equals(getTipoDeTenencia(), that.getTipoDeTenencia()) &&
                Objects.equals(getFechaBaja(), that.getFechaBaja()) &&
                Objects.equals(getDetallesBaja(), that.getDetallesBaja()) &&
                Objects.equals(getNoCertTenInscrito(), that.getNoCertTenInscrito()) &&
                Objects.equals(getCultOActivAgroDediAct(), that.getCultOActivAgroDediAct()) &&
                Objects.equals(getExistirCausas(), that.getExistirCausas());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getPersonaParcelaPK(), getParcela(), getPersona(), getFechaAlta(), getTipoDeTenencia(), getFechaBaja(), getDetallesBaja(), getGradoDeExplotacion(), getNoCertTenInscrito(), getCultOActivAgroDediAct(), getAreaVacia(), getExistirCausas());
    }

    @Override
    public String toString() {
        return "PersonaParcela{" +
                "personaParcelaPK=" + personaParcelaPK +
                ", parcela=" + parcela +
                ", persona=" + persona +
                ", fechaAlta=" + fechaAlta +
                ", tipoDeTenencia='" + tipoDeTenencia + '\'' +
                ", fechaBaja=" + fechaBaja +
                ", detallesBaja='" + detallesBaja + '\'' +
                ", gradoDeExplotacion=" + gradoDeExplotacion +
                ", noCertTenInscrito=" + noCertTenInscrito +
                ", cultOActivAgroDediAct='" + cultOActivAgroDediAct + '\'' +
                ", areaVacia=" + areaVacia +
                ", existirCausas='" + existirCausas + '\'' +
                '}';
    }
}
