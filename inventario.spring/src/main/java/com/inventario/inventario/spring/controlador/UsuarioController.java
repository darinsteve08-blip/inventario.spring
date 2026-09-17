package com.inventario.inventario.spring.controlador;

import com.inventario.inventario.spring.model.Usuario;
import com.inventario.inventario.spring.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Ruta para listar usuarios (limpiando contraseñas por seguridad)
    @GetMapping("/index")
    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        // Borramos la contraseña de la respuesta JSON por seguridad
        usuarios.forEach(u -> u.setPassword(""));
        return usuarios;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuarioLogin) {
        // Tomamos lo que escribió el usuario en el campo (puede ser username o correo)
        String identificador = usuarioLogin.getUsername();

        // Buscamos si coincide con el username O con el email
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByUsernameOrEmail(identificador, identificador);

        if (usuarioEncontrado.isPresent()) {
            Usuario user = usuarioEncontrado.get();
            
            // Validamos contraseña
            if (user.getPassword() != null && user.getPassword().equals(usuarioLogin.getPassword())) {
                user.setPassword(""); // Limpiamos la contraseña antes de devolver el usuario
                return ResponseEntity.ok(user);
            }
        }
        
        return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        usuario.setRol("OPERARIO");
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
