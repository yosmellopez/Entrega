/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.*;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * @author Pablo Caram Local
 */
@Entity
@Table(name = "parcela")
public class Parcela implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_parcela_consejoPopular"))
    private ConsejoPopular consejoPopular;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_parcela_poseedor"))
    private Persona persona;

    @Column(name = "zonaCatastral")
    private Integer zonaCatastral;

    @Column(name = "parcela")
    private Integer parcela;

    @Column(name = "divicion")
    private Integer divicion;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_parcela_tipoDeUso"))
    private TipoDeUso tipoDeUso;

    @Column(name = "area")
    private Double area;

    @Column(name = "limiteN")
    private String limiteN;

    @Column(name = "limiteS")
    private String limiteS;

    @Column(name = "limiteE")
    private String limiteE;

    @Column(name = "limiteW")
    private String limiteW;

    @JsonIgnore
    @ManyToMany(cascade = {CascadeType.ALL})
    @JoinTable(name = "Parcelas_Regulaciones",
            joinColumns = {@JoinColumn(name = "parcela_id")},
            inverseJoinColumns = {@JoinColumn(name = "regulacion_id")})
    Set<Regulaciones> regulaciones = new HashSet<>();

    @JsonIgnore
    @ManyToMany(cascade = {CascadeType.ALL})
    @JoinTable(name = "Parcelas_Bienhechurias",
            joinColumns = {@JoinColumn(name = "parcela_id")},
            inverseJoinColumns = {@JoinColumn(name = "bienhechuria_id")})
    Set<Bienhechurías> bienhechurias = new HashSet<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "parcelas")
    private List<Solicitud> solicitudes;

    public TipoDeUso getTipoDeUso() {
        return tipoDeUso;
    }

    public void setTipoDeUso(TipoDeUso tipoDeUso) {
        this.tipoDeUso = tipoDeUso;
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

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Integer getZonaCatastral() {
        return zonaCatastral;
    }

    public void setZonaCatastral(Integer zonaCatastral) {
        this.zonaCatastral = zonaCatastral;
    }

    public Integer getParcela() {
        return parcela;
    }

    public void setParcela(Integer parcela) {
        this.parcela = parcela;
    }

    public Integer getDivicion() {
        return divicion;
    }

    public void setDivicion(Integer divicion) {
        this.divicion = divicion;
    }

    public Double getArea() {
        return area;
    }

    public void setArea(Double area) {
        this.area = area;
    }

    public String getLimiteN() {
        return limiteN;
    }

    public void setLimiteN(String limiteN) {
        this.limiteN = limiteN;
    }

    public String getLimiteS() {
        return limiteS;
    }

    public void setLimiteS(String limiteS) {
        this.limiteS = limiteS;
    }

    public String getLimiteE() {
        return limiteE;
    }

    public void setLimiteE(String limiteE) {
        this.limiteE = limiteE;
    }

    public String getLimiteW() {
        return limiteW;
    }

    public void setLimiteW(String limiteW) {
        this.limiteW = limiteW;
    }

    public Set<Regulaciones> getRegulaciones() {
        return regulaciones;
    }

    public void setRegulaciones(Set<Regulaciones> regulaciones) {
        this.regulaciones = regulaciones;
    }

    public Set<Bienhechurías> getBienhechurias() {
        return bienhechurias;
    }

    public void setBienhechurias(Set<Bienhechurías> bienhechurias) {
        this.bienhechurias = bienhechurias;
    }

    public List<Solicitud> getSolicitudes() {
        return solicitudes;
    }

    public void setSolicitudes(List<Solicitud> solicitudes) {
        this.solicitudes = solicitudes;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object o) {
        Parcela parcela = (Parcela) o;
        if (id == null && parcela.id == null)
            return false;
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return Objects.equals(id, parcela.id);
    }

    @Override
    public String toString() {
        return "Parcela{" +
                "id=" + id +
                ", consejoPopular=" + consejoPopular +
                ", persona=" + persona +
                ", zonaCatastral=" + zonaCatastral +
                ", parcela=" + parcela +
                ", divicion=" + divicion +
                ", tipoDeUso=" + tipoDeUso +
                ", area=" + area +
                ", limiteN='" + limiteN + '\'' +
                ", limiteS='" + limiteS + '\'' +
                ", limiteE='" + limiteE + '\'' +
                ", limiteW='" + limiteW + '\'' +
                '}';
    }
}
