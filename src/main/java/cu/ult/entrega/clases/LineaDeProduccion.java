/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author Pablo Caram Local
 */
@Entity
@Table(name = "linea_de_produccion")
public class LineaDeProduccion implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(foreignKey = @ForeignKey(name = "fk_lineaDeProduccion_solicitud"))
    @JsonBackReference
    private Solicitud solicitud;
    
    @Column (name = "lineaDeProduccion")
    private String lineaDeProduccion;

    @Column (name = "aprobado")
    private Boolean aprobado;

    @Column (name = "areaDedicada")
    private Double areaDedicada;
    
    @Column (name = "estudioSuelo")
    private String estudioSuelo;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Solicitud getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(Solicitud solicitud) {
        this.solicitud = solicitud;
    }

    public String getLineaDeProduccion() {
        return lineaDeProduccion;
    }

    public void setLineaDeProduccion(String lineaDeProduccion) {
        this.lineaDeProduccion = lineaDeProduccion;
    }

    public Boolean getAprobado() {
        return aprobado;
    }

    public void setAprobado(Boolean aprobado) {
        this.aprobado = aprobado;
    }

    public Double getAreaDedicada() {
        return areaDedicada;
    }

    public void setAreaDedicada(Double areaDedicada) {
        this.areaDedicada = areaDedicada;
    }

    public String getEstudioSuelo() {
        return estudioSuelo;
    }

    public void setEstudioSuelo(String estudioSuelo) {
        this.estudioSuelo = estudioSuelo;
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
        if (!(object instanceof LineaDeProduccion)) {
            return false;
        }
        LineaDeProduccion other = (LineaDeProduccion) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entrega.clases.LineaDeProduccion[ id=" + id + " ]";
    }
    
}
