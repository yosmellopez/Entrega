package cu.ult.entrega.clases;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ParcelaBienhechuriaPK implements Serializable {

    @Column(name = "parcela_id")
    private Long parcelaId;

    @Column(name = "bienhechuria_id")
    private Long bienhechuriaId;

    public ParcelaBienhechuriaPK() {
    }

    public ParcelaBienhechuriaPK(Long parcelaId, Long bienhechuriaId) {
        this.parcelaId = parcelaId;
        this.bienhechuriaId = bienhechuriaId;
    }

    public Long getParcelaId() {
        return parcelaId;
    }

    public void setParcelaId(Long parcelaId) {
        this.parcelaId = parcelaId;
    }

    public Long getBienhechuriaId() {
        return bienhechuriaId;
    }

    public void setBienhechuriaId(Long bienhechuriaId) {
        this.bienhechuriaId = bienhechuriaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ParcelaBienhechuriaPK)) return false;
        ParcelaBienhechuriaPK that = (ParcelaBienhechuriaPK) o;
        return Objects.equals(getParcelaId(), that.getParcelaId()) &&
                Objects.equals(getBienhechuriaId(), that.getBienhechuriaId());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getParcelaId(), getBienhechuriaId());
    }

    @Override
    public String toString() {
        return "ParcelaBienhechuriaPK{" +
                "parcelaId=" + parcelaId +
                ", bienhechuriaId=" + bienhechuriaId +
                '}';
    }
}
