/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.clases;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 *
 * @author Pablo Caram Local
 */
@Entity
@Table(name = "tramite")
public class Tramite implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column (name = "fechaConcilONHG")
    private Date fechaConcilONHG;
    
    @Column (name = "fechaEntreMedicion")
    private Date fechaEntreMedicion;
    
    @Column (name = "fechaConcInstSuelo")
    private Date fechaConcInstSuelo;
    
    @Column (name = "fechaEntregaEstudioSuelo")
    private Date fechaEntregaEstudioSuelo;
    
    @Column (name = "fechaConcPlanFis")
    private Date fechaConcPlanFis;
    
    @Column (name = "fechaEntrega_regulaciones")
    private Date fechaEntregaRegulaciones;
    
    @Column (name = "fechaConcEmpAgric")
    private Date fechaConcEmpAgric;
    
    @Column (name = "fechaEntregValoBienchurías")
    private Date fechaEntregValoBienchurías;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitud_id")
    private Solicitud solicitud;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getFechaConcilONHG() {
        return fechaConcilONHG;
    }

    public void setFechaConcilONHG(Date fechaConcilONHG) {
        this.fechaConcilONHG = fechaConcilONHG;
    }

    public Date getFechaEntreMedicion() {
        return fechaEntreMedicion;
    }

    public void setFechaEntreMedicion(Date fechaEntreMedicion) {
        this.fechaEntreMedicion = fechaEntreMedicion;
    }

    public Date getFechaConcInstSuelo() {
        return fechaConcInstSuelo;
    }

    public void setFechaConcInstSuelo(Date fechaConcInstSuelo) {
        this.fechaConcInstSuelo = fechaConcInstSuelo;
    }

    public Date getFechaEntregaEstudioSuelo() {
        return fechaEntregaEstudioSuelo;
    }

    public void setFechaEntregaEstudioSuelo(Date fechaEntregaEstudioSuelo) {
        this.fechaEntregaEstudioSuelo = fechaEntregaEstudioSuelo;
    }

    public Date getFechaConcPlanFis() {
        return fechaConcPlanFis;
    }

    public void setFechaConcPlanFis(Date fechaConcPlanFis) {
        this.fechaConcPlanFis = fechaConcPlanFis;
    }

    public Date getFechaEntregaRegulaciones() {
        return fechaEntregaRegulaciones;
    }

    public void setFechaEntregaRegulaciones(Date fechaEntregaRegulaciones) {
        this.fechaEntregaRegulaciones = fechaEntregaRegulaciones;
    }

    public Date getFechaConcEmpAgric() {
        return fechaConcEmpAgric;
    }

    public void setFechaConcEmpAgric(Date fechaConcEmpAgric) {
        this.fechaConcEmpAgric = fechaConcEmpAgric;
    }

    public Date getFechaEntregValoBienchurías() {
        return fechaEntregValoBienchurías;
    }

    public void setFechaEntregValoBienchurías(Date fechaEntregValoBienchurías) {
        this.fechaEntregValoBienchurías = fechaEntregValoBienchurías;
    }

    public Solicitud getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(Solicitud solicitud) {
        this.solicitud = solicitud;
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
        if (!(object instanceof Tramite)) {
            return false;
        }
        Tramite other = (Tramite) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entrega.clases.Tramite[ id=" + id + " ]";
    }
    
}
