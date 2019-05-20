/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.io.Serializable;
import java.util.*;
import javax.persistence.*;

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

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "zonaCatastral")
    private Integer zonaCatastral;

    @Column(name = "parcela")
    private Integer parcela;

    @Column(name = "divicion")
    private Integer divicion;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_parcela_tipo_uso"))
    private TipoUso tipoUso;

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

    @Column(name = "condicActual")
    private String condicActual;

    @JsonIgnore
    @ManyToMany(cascade = {CascadeType.ALL})
    @JoinTable(name = "Parcelas_Regulaciones",
            joinColumns = {@JoinColumn(name = "parcela_id")},
            inverseJoinColumns = {@JoinColumn(name = "regulacion_id")})
    Set<Regulaciones> regulaciones = new HashSet<>();

    @OneToMany(mappedBy = "parcela")
    @JsonIgnoreProperties(value = {"parcela"})
    @org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<ParcelaBienhechuria> parcelaBienhechurias;

    @JsonIgnore
    @ManyToMany(mappedBy = "parcelas")
    private List<Solicitud> solicitudes;

    public TipoUso getTipoUso() {
        return tipoUso;
    }

    public void setTipoUso(TipoUso tipoUso) {
        this.tipoUso = tipoUso;
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

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCondicActual() {
        return condicActual;
    }

    public void setCondicActual(String condicActual) {
        this.condicActual = condicActual;
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

    public Set<ParcelaBienhechuria> getParcelaBienhechurias() {
        return parcelaBienhechurias;
    }

    public void setParcelaBienhechurias(Set<ParcelaBienhechuria> parcelaBienhechurias) {
        this.parcelaBienhechurias = parcelaBienhechurias;
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
                ", zonaCatastral=" + zonaCatastral +
                ", parcela=" + parcela +
                ", divicion=" + divicion +
                ", tipoUso=" + tipoUso +
                ", area=" + area +
                ", limiteN='" + limiteN + '\'' +
                ", limiteS='" + limiteS + '\'' +
                ", limiteE='" + limiteE + '\'' +
                ", limiteW='" + limiteW + '\'' +
                '}';
    }
}
