package cu.ult.entrega.control;

import cu.ult.entrega.clases.Rol;
import cu.ult.entrega.clases.Usuario;
import cu.ult.entrega.repositorio.RolRepository;
import cu.ult.entrega.repositorio.UsuarioRepository;
import org.hibernate.exception.SQLGrammarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceException;
import javax.servlet.http.Part;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Usuario.
 */
@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    RolRepository rolRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping(value = "/usuario")
    public ResponseEntity<AppResponse<Usuario>> listarUsuarios(Pageable p, ModelMap map) {
        Page<Usuario> usuarios = usuarioRepository.findAll(p);
        return ResponseEntity.ok(AppResponse.success(usuarios.getContent()).total(usuarios.getTotalElements()).build());
    }

    @GetMapping(value = "/roles")
    public ResponseEntity<AppResponse<Rol>> listarRoles() {
        List<Rol> roles = rolRepository.findAll();
        return ResponseEntity.ok(AppResponse.success(roles).build());
    }

    @GetMapping(value = "/auth/autenticated")
    public ResponseEntity<Auth> verificarAuthenticated(@AuthenticationPrincipal Usuario usuario) {
        Optional<Usuario> optional = Optional.ofNullable(usuario);
        boolean present = optional.isPresent();
        if (present) {
            return ResponseEntity.ok(Auth.create(usuario, present));
        }
        return ResponseEntity.ok(Auth.create(null, present));
    }

    @GetMapping(value = "/auth/checkAutenticated")
    public ResponseEntity<LoginStatus> checkAuthentication(@AuthenticationPrincipal Usuario usuario) {
        Optional<Usuario> optional = Optional.ofNullable(usuario);
        LoginStatus loginStatus = new LoginStatus(false, null, "");
        if (optional.isPresent()) {
            loginStatus = new LoginStatus(true, usuario, "Autenticado");
        }
        return ResponseEntity.ok(loginStatus);
    }

    @GetMapping(value = "/me")
    public ResponseEntity<AppResponse<Usuario>> currentUser(@AuthenticationPrincipal Usuario usuario) {
        Optional<Usuario> optional = Optional.ofNullable(usuario);
        if (optional.isPresent())
            return ResponseEntity.ok(AppResponse.success(usuario).build());
        return ResponseEntity.ok(AppResponse.failure("Su sesion ha expirado").build());
    }

    @PostMapping(value = "/usuario")
    public ResponseEntity<AppResponse<Usuario>> insertarUsuario(@RequestBody Usuario usuario) {
        usuarioRepository.saveAndFlush(usuario);
        return ResponseEntity.ok(AppResponse.success("Usuario insertado exitosamente.").elemento(usuario).build());
    }

    @PostMapping(value = "/usuario/uploadImagen")
    public ResponseEntity<AppResponse<Imagen>> subirImagenUsuario(@RequestPart("file") Part imagenFile, @AuthenticationPrincipal Usuario usuario) throws IOException {
        String nombre = imagenFile.getSubmittedFileName();
        Path archivoPath = Paths.get(WebUtil.FILE_UPLOAD_DIR).resolve("imagenes/" + nombre);
        Files.copy(imagenFile.getInputStream(), archivoPath, StandardCopyOption.REPLACE_EXISTING);
        imagenFile.delete();
        String direccion = "imagenes/" + nombre;
        Imagen imagen = new Imagen(nombre, direccion);
        imagenRepository.saveAndFlush(imagen);
        usuario.setImagen(imagen);
        usuarioRepository.saveAndFlush(usuario);
        String mensaje = "Imagen " + imagen.getTitulo() + " subida exitosamente";
        return ResponseEntity.ok(AppResponse.success(imagen).msg(mensaje).build());
    }

    @PostMapping(value = "/usuario/registro")
    public ResponseEntity<AppResponse<Usuario>> registro(@RequestBody Usuario usuario) {
        System.out.println(usuario);
        usuario.setRol(rolRepository.findById(2).orElseThrow(() -> new EntityNotFoundException()));
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuarioRepository.saveAndFlush(usuario);
        return ResponseEntity.ok(AppResponse.success(usuario)
                .msg(String.format("Usuario %1$s registrado exitosamente", usuario.getNombreCompleto())).build());
    }

    @PutMapping(value = "/usuario/{idUsuario}")
    public ResponseEntity<AppResponse<Usuario>> actualizarUsuario(@PathVariable("idUsuario") Usuario usuarioBd, @RequestBody Usuario usuario) {
        Optional.ofNullable(usuario.getContrasena()).ifPresent(password -> {
            if (!password.isEmpty())
                usuario.setContrasena(passwordEncoder.encode(password));
        });
        usuarioBd.clonarDatos(usuario);
        usuarioRepository.saveAndFlush(usuarioBd);
        return ResponseEntity.ok(AppResponse.success(usuarioBd).build());
    }

    @DeleteMapping(value = "/usuario/{idUsuario}")
    public ResponseEntity<AppResponse<Usuario>> eliminarUsuario(@PathVariable("idUsuario") Optional<Usuario> optional) {
        usuarioRepository.deleteById(optional.map(Usuario::getId).orElseThrow(() -> new EntityNotFoundException("No existe este usuario")));
        return ResponseEntity.ok(AppResponse.success().total(usuarioRepository.count()).build());
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<AppResponse> nullException(NullPointerException e) {
        e.printStackTrace();
        return ResponseEntity.ok(AppResponse.failure("Problema").build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse> tratarExcepcion(Exception e) {
        String mensaje = "";
        if (e instanceof JpaSystemException) {
            JpaSystemException jse = (JpaSystemException) e;
            mensaje = tratarMensaje(jse.getMostSpecificCause());
        } else if (e instanceof PersistenceException) {
            JpaSystemException exception = new JpaSystemException((RuntimeException) e);
            mensaje = tratarMensaje(exception.getMostSpecificCause());
        } else if (e instanceof DataIntegrityViolationException) {
            DataIntegrityViolationException exception = (DataIntegrityViolationException) e;
            mensaje = tratarMensaje(exception.getMostSpecificCause());
        } else if (e instanceof SQLGrammarException) {
            SQLGrammarException exception = (SQLGrammarException) e;
            mensaje = tratarMensaje(exception.getCause());
        } else {
            mensaje = e.getLocalizedMessage();
        }
        return ResponseEntity.ok(AppResponse.failure(mensaje).build());
    }

    private String tratarMensaje(Throwable e) {
        String message = e.getMessage();
        if (message.contains("nombre_apellidos_unico")) {
            return "Ya existe un usuario con ese nombre y los apellidos.";
        } else if (message.contains("usuario_unico")) {
            return "Ya existe un usuario con ese nombre de usuario";
        } else if (message.contains("usuario_ci_unico")) {
            return "Ya existe un usuario con ese nombre de usuario";
        } else {
            return message;
        }
    }

}
