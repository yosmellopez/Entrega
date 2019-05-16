/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.persistence.*;

/**
 * @author Pablo Caram Local
 */
@Entity
@Table(name = "solicitud", uniqueConstraints = @UniqueConstraint(name = "solicitud_unica", columnNames = {"numExpediente"}))
public class Solicitud implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tipoDecreto")
    private String tipoDecreto;

    @Column(name = "tipoSolicitud")
    private String tipoSolicitud;

    @Column(name = "fechaSolicitud")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date fechaSolicitud;

    @Column(name = "numExpediente")
    private Integer numExpediente;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_solicitud_persona"))
    private Persona persona;

    @ManyToMany
    @JoinTable(name = "solicitud_parcela",
            joinColumns = @JoinColumn(name = "solicitud_id", foreignKey = @ForeignKey(name = "fk_solicitud_parcela")),
            inverseJoinColumns = @JoinColumn(name = "parcela_id", foreignKey = @ForeignKey(name = "fk_parcela_solicitud")))
    Set<Parcela> parcelas = new HashSet<>();

    @OneToMany(mappedBy = "solicitud")
    @JsonManagedReference
    private List<LineaDeProduccion> lineasDeProduccion;

    @Column(name = "areaSolicitada")
    private Double areaSolicitada;

    @OneToOne(mappedBy = "solicitud", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Tramite tramite;

    @Column(name = "estado")
    private String estado;

    @Column(name = "aprobadoCAgraria")
    private String aprobadoCAgraria;

    @Column(name = "aprobadoPCC")
    private String aprobadoPCC;

    @Column(name = "detallesAproDesa")
    private String detallesAproDesa;

    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey (name = "fk_solicitud_municipio"))
    private Municipio municipio;

    @Column(name = "detallesMT")
    private String detallesMT;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(Date fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getTipoDecreto() {
        return tipoDecreto;
    }

    public void setTipoDecreto(String tipoDecreto) {
        this.tipoDecreto = tipoDecreto;
    }

    public Integer getNumExpediente() {
        return numExpediente;
    }

    public void setNumExpediente(Integer numExpediente) {
        this.numExpediente = numExpediente;
    }

    public List<LineaDeProduccion> getLineasDeProduccion() {
        return lineasDeProduccion;
    }

    public void setLineasDeProduccion(List<LineaDeProduccion> lineasDeProduccion) {this.lineasDeProduccion = lineasDeProduccion;}

    public Double getAreaSolicitada() {
        return areaSolicitada;
    }

    public void setAreaSolicitada(Double areaSolicitada) {
        this.areaSolicitada = areaSolicitada;
    }

    public Tramite getTramite() {
        return tramite;
    }

    public void setTramite(Tramite tramite) {
        this.tramite = tramite;
    }

    public String getTipoSolicitud() {
        return tipoSolicitud;
    }

    public void setTipoSolicitud(String tipoSolicitud) {
        this.tipoSolicitud = tipoSolicitud;
    }

    public Set<Parcela> getParcelas() {
        return parcelas;
    }

    public void setParcelas(Set<Parcela> parcelas) {
        this.parcelas = parcelas;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getAprobadoCAgraria() {
        return aprobadoCAgraria;
    }

    public void setAprobadoCAgraria(String aprobadoCAgraria) {
        this.aprobadoCAgraria = aprobadoCAgraria;
    }

    public String getAprobadoPCC() {
        return aprobadoPCC;
    }

    public void setAprobadoPCC(String aprobadoPCC) {
        this.aprobadoPCC = aprobadoPCC;
    }

    public String getDetallesAproDesa() {
        return detallesAproDesa;
    }

    public void setDetallesAproDesa(String detallesAproDesa) {
        this.detallesAproDesa = detallesAproDesa;
    }

    public Municipio getMunicipio() {
        return municipio;
    }

    public void setMunicipio(Municipio municipio) {
        this.municipio = municipio;
    }

    public String getDetallesMT() {
        return detallesMT;
    }

    public void setDetallesMT(String detallesMT) {
        this.detallesMT = detallesMT;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Solicitud)) {
            return false;
        }
        Solicitud other = (Solicitud) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entrega.clases.Solicitud[ id=" + id + " ]";
    }

}