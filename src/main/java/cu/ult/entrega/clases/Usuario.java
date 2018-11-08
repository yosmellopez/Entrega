package cu.ult.entrega.clases;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import cu.ult.entrega.json.SerializadorPassword;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
@Table(name = "usuario", uniqueConstraints = {@UniqueConstraint(name = "unique_username", columnNames = {"username"})})
public class Usuario implements UserDetails, Serializable {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    @NotNull(message = "usuario_name_not_null")
    private String name;

    @Column(name = "lastname")
    @NotNull(message = "usuario_lastname_not_null")
    private String lastname;

    @NotNull(message = "usuario_username_not_null")
    @Size(message = "", min = 0, max = 50)
    @Column(name = "username")
    private String username;

    @NotNull(message = "usuario_email_not_null")
    @Size(message = "", min = 0, max = 50)
    @Column(name = "email")
    private String email;

    @Column(name = "password_key")
    @Size(message = "usuario_password_size", max = 200)
    @JsonSerialize(using = SerializadorPassword.class)
    private String password;

    @Column(name = "last_login")
    @JsonFormat(pattern = "dd/MM/yyyy hh:mm a")
    private LocalDateTime lastLogin;

    @Column(name = "activated")
    private Boolean activated;

    @ManyToOne(optional = false)
    @NotNull(message = "usuario_rol_not_null")
    @JoinColumn(name = "rol_id", foreignKey = @ForeignKey(name = "fk_usuario_rol"))
    private Rol rol;

    public Usuario() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombreCompleto (){
        return this.name+' '+ this.lastname;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return activated;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<>(Arrays.asList(rol));
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Boolean getActivated() {
        return activated;
    }

    public void setActivated(Boolean activated) {
        this.activated = activated;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(id, usuario.id);
    }

    @Override
    public int hashCode() {

        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", lastname='" + lastname + '\'' +
                ", username='" + username + '\'' +
                ", rol=" + rol +
                '}';
    }
}
