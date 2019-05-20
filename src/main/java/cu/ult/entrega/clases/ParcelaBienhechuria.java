package cu.ult.entrega.clases;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "parcela_bienhechuria")
public class ParcelaBienhechuria implements Serializable {

    @EmbeddedId
    ParcelaBienhechuriaPK parcelaBienhechuriaPK;

    @ManyToOne(optional = false)
    @JoinColumn(name = "parcela_id", foreignKey = @ForeignKey(name = "fk_parcela_bienhechuria"), insertable = false, updatable = false)
    private Parcela parcela;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bienhechuria_id", foreignKey = @ForeignKey(name = "fk_bienhechuria_parcela"), insertable = false, updatable = false)
    private Bienhechuria bienhechurías;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "precio")
    private Float precio;

    public ParcelaBienhechuria (){
    }

    public ParcelaBienhechuria (ParcelaBienhechuriaPK parcelaBienhechuriaPK){
        this.parcelaBienhechuriaPK = parcelaBienhechuriaPK;
    }

    public ParcelaBienhechuriaPK getParcelaBienhechuriaPK() {
        return parcelaBienhechuriaPK;
    }

    public void setParcelaBienhechuriaPK(ParcelaBienhechuriaPK parcelaBienhechuriaPK) {
        this.parcelaBienhechuriaPK = parcelaBienhechuriaPK;
    }

    public Parcela getParcela() {
        return parcela;
    }

    public void setParcela(Parcela parcela) {
        this.parcela = parcela;
    }

    public Bienhechuria getBienhechurías() {
        return bienhechurías;
    }

    public void setBienhechurías(Bienhechuria bienhechurías) {
        this.bienhechurías = bienhechurías;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Float getPrecio() {
        return precio;
    }

    public void setPrecio(Float precio) {
        this.precio = precio;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParcelaBienhechuria)) return false;
        ParcelaBienhechuria that = (ParcelaBienhechuria) o;
        return Objects.equals(getParcelaBienhechuriaPK(), that.getParcelaBienhechuriaPK()) &&
                Objects.equals(getParcela(), that.getParcela()) &&
                Objects.equals(getBienhechurías(), that.getBienhechurías()) &&
                Objects.equals(getCantidad(), that.getCantidad()) &&
                Objects.equals(getPrecio(), that.getPrecio());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getParcelaBienhechuriaPK(), getParcela(), getBienhechurías(), getCantidad(), getPrecio());
    }

    @Override
    public String toString() {
        return "ParcelaBienhechuria{" +
                "parcelaBienhechuriaPK=" + parcelaBienhechuriaPK +
                ", parcela=" + parcela +
                ", bienhechurías=" + bienhechurías +
                ", cantidad=" + cantidad +
                ", precio=" + precio +
                '}';
    }
}
