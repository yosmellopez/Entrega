package cu.ult.entrega.clases;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PersonaParcelaPK implements Serializable {

    @Column(name = "parcela_id")
    private Long parcelaId;

    @Column(name = "persona_id")
    private Long personaId;

    public PersonaParcelaPK() {
    }

    public PersonaParcelaPK(Long parcelaId, Long personaId) {
        this.parcelaId = parcelaId;
        this.personaId = personaId;
    }

    public Long getParcelaId() {
        return parcelaId;
    }

    public void setParcelaId(Long parcelaId) {
        this.parcelaId = parcelaId;
    }

    public Long getPersonaId() {
        return personaId;
    }

    public void setPersonaId(Long personaId) {
        this.personaId = personaId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PersonaParcelaPK)) return false;
        PersonaParcelaPK that = (PersonaParcelaPK) o;
        return Objects.equals(getParcelaId(), that.getParcelaId()) &&
                Objects.equals(getPersonaId(), that.getPersonaId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getParcelaId(), getPersonaId());
    }

    @Override
    public String toString() {
        return "PersonaParcelaPK{" +
                "parcelaId=" + parcelaId +
                ", personaId=" + personaId +
                '}';
    }
}
