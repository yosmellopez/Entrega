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
import javax.persistence.*;

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
    private Boolean sexo;

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

    @Column(name = "estadoCivil")
    private String estadoCivil;

    @Column(name = "experiencia_agricola")
    private Integer experienciaAgricola;

    @OneToMany(mappedBy = "asociado")
    @JsonManagedReference
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

    @ManyToMany
    @JoinTable(name = "persona_integracion", joinColumns = @JoinColumn(name = "persona_id", foreignKey = @ForeignKey(name = "fk_persona_integracion")),
            inverseJoinColumns = @JoinColumn(name = "integracion_id", foreignKey = @ForeignKey(name = "fk_integracion_persona")))
    private Set<Integracion> integraciones;

    public Persona() {
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

    public Boolean getSexo() {
        return sexo;
    }

    public void setSexo(Boolean sexo) {
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

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public Integer getExperienciaAgricola() {
        return experienciaAgricola;
    }

    public void setExperienciaAgricola(Integer experienciaAgricola) {
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

    public Set<Integracion> getIntegraciones() {
        return integraciones;
    }

    public void setIntegraciones(Set<Integracion> integraciones) {
        this.integraciones = integraciones;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Persona persona = (Persona) o;
        return Objects.equals(id, persona.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
