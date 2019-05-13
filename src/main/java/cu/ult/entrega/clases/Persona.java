/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.UniqueConstraint;

/**
 * @author Pablo Caram Local
 */
@Entity
@Table(name = "persona", uniqueConstraints = @UniqueConstraint(name = "persona_unica", columnNames = {"ci"}))
public class Persona implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_persona_consejoPopular"))
    private ConsejoPopular consejoPopular;

    @Column(name = "tipoPersona")
    private String tipoPersona;

    @Column(name = "ci")
    private String ci;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "primerApellido")
    private String primerApellido;

    @Column(name = "segundoApellido")
    private String segundoApellido;

    @Column(name = "sexo")
    private Character sexo;

    @Column(name = "dirParticular")
    private String dirParticular;

    @Column(name = "edad")
    private Integer edad;

    @Column(name = "movil")
    private String movil;

    @Column(name = "telFijo")
    private String telFijo;

    @Column(name = "situacionLaboral")
    private String situacionLaboral;

    @Column(name = "integracion")
    private String integracion;

    @Column(name = "estadoCivil")
    private String estadoCivil;

    @Column(name = "integracion")
    private int experienciaAgricola;

    @OneToMany(mappedBy = "asociado")
    private List<PersonaAyuda> personasAyuda;

    @JsonIgnore
    @JsonIgnoreProperties({"personas"})
    @OneToMany(mappedBy = "asociado")
    private List<Persona> personas;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_persona_asociado"))
    private Persona asociado;

    @JsonIgnore
    @OneToMany(mappedBy = "persona")
    private List<Solicitud> solicitud;

    @OneToMany(mappedBy = "persona")
    @JsonIgnoreProperties(value = {"persona"})
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<PersonaParcela> personaParcelas;

    public Persona() {
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ConsejoPopular getConsejoPopular() {
        return consejoPopular;
    }

    public void setConsejoPopular(ConsejoPopular consejoPopular) {
        this.consejoPopular = consejoPopular;
    }

    public String getTipoPersona() {
        return tipoPersona;
    }

    public void setTipoPersona(String tipoPersona) {
        this.tipoPersona = tipoPersona;
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

    public Character getSexo() {
        return sexo;
    }

    public void setSexo(Character sexo) {
        this.sexo = sexo;
    }

    public String getDirParticular() {
        return dirParticular;
    }

    public void setDirParticular(String dirParticular) {
        this.dirParticular = dirParticular;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getMovil() {
        return movil;
    }

    public void setMovil(String movil) {
        this.movil = movil;
    }

    public String getTelFijo() {
        return telFijo;
    }

    public void setTelFijo(String telFijo) {
        this.telFijo = telFijo;
    }

    public String getSituacionLaboral() {
        return situacionLaboral;
    }

    public void setSituacionLaboral(String situacionLaboral) {
        this.situacionLaboral = situacionLaboral;
    }

    public String getIntegracion() {
        return integracion;
    }

    public void setIntegracion(String integracion) {
        this.integracion = integracion;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public int getExperienciaAgricola() {
        return experienciaAgricola;
    }

    public void setExperienciaAgricola(int experienciaAgricola) {
        this.experienciaAgricola = experienciaAgricola;
    }

    public List<PersonaAyuda> getPersonasAyuda() {
        return personasAyuda;
    }

    public void setPersonasAyuda(List<PersonaAyuda> personasAyuda) {
        this.personasAyuda = personasAyuda;
    }

    public List<Persona> getPersonas() {
        return personas;
    }

    public void setPersonas(List<Persona> personas) {
        this.personas = personas;
    }

    public Persona getAsociado() {
        return asociado;
    }

    public void setAsociado(Persona asociado) {
        this.asociado = asociado;
    }

    public List<Solicitud> getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(List<Solicitud> solicitud) {
        this.solicitud = solicitud;
    }

    public Set<PersonaParcela> getPersonaParcelas() {
        return personaParcelas;
    }

    public void setPersonaParcelas(Set<PersonaParcela> personaParcelas) {
        this.personaParcelas = personaParcelas;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Persona)) return false;
        Persona persona = (Persona) o;
        return getExperienciaAgricola() == persona.getExperienciaAgricola() &&
                Objects.equals(getId(), persona.getId()) &&
                Objects.equals(getConsejoPopular(), persona.getConsejoPopular()) &&
                Objects.equals(getTipoPersona(), persona.getTipoPersona()) &&
                Objects.equals(getCi(), persona.getCi()) &&
                Objects.equals(getNombre(), persona.getNombre()) &&
                Objects.equals(getPrimerApellido(), persona.getPrimerApellido()) &&
                Objects.equals(getSegundoApellido(), persona.getSegundoApellido()) &&
                Objects.equals(getSexo(), persona.getSexo()) &&
                Objects.equals(getDirParticular(), persona.getDirParticular()) &&
                Objects.equals(getEdad(), persona.getEdad()) &&
                Objects.equals(getMovil(), persona.getMovil()) &&
                Objects.equals(getTelFijo(), persona.getTelFijo()) &&
                Objects.equals(getSituacionLaboral(), persona.getSituacionLaboral()) &&
                Objects.equals(getIntegracion(), persona.getIntegracion()) &&
                Objects.equals(getEstadoCivil(), persona.getEstadoCivil()) &&
                Objects.equals(getPersonasAyuda(), persona.getPersonasAyuda()) &&
                Objects.equals(getPersonas(), persona.getPersonas()) &&
                Objects.equals(getAsociado(), persona.getAsociado()) &&
                Objects.equals(getSolicitud(), persona.getSolicitud()) &&
                Objects.equals(getPersonaParcelas(), persona.getPersonaParcelas());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getId(), getConsejoPopular(), getTipoPersona(), getCi(), getNombre(), getPrimerApellido(), getSegundoApellido(), getSexo(), getDirParticular(), getEdad(), getMovil(), getTelFijo(), getSituacionLaboral(), getIntegracion(), getEstadoCivil(), getExperienciaAgricola(), getPersonasAyuda(), getPersonas(), getAsociado(), getSolicitud(), getPersonaParcelas());
    }

    @Override
    public String toString() {
        return "Persona{" +
                "id=" + id +
                ", consejoPopular=" + consejoPopular +
                ", tipoPersona='" + tipoPersona + '\'' +
                ", ci='" + ci + '\'' +
                ", nombre='" + nombre + '\'' +
                ", primerApellido='" + primerApellido + '\'' +
                ", segundoApellido='" + segundoApellido + '\'' +
                ", sexo=" + sexo +
                ", dirParticular='" + dirParticular + '\'' +
                ", edad=" + edad +
                ", movil='" + movil + '\'' +
                ", telFijo='" + telFijo + '\'' +
                ", situacionLaboral='" + situacionLaboral + '\'' +
                ", integracion='" + integracion + '\'' +
                ", estadoCivil='" + estadoCivil + '\'' +
                ", experienciaAgricola=" + experienciaAgricola +
                ", personasAyuda=" + personasAyuda +
                ", personas=" + personas +
                ", asociado=" + asociado +
                ", solicitud=" + solicitud +
                ", personaParcelas=" + personaParcelas +
                '}';
    }
}
