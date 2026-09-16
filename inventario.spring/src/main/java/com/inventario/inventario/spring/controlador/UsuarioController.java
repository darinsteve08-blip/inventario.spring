package com.inventario.inventario.spring.controlador;
import com.inventario.inventario.spring.model.Usuario;
import com.inventario.inventario.spring.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") // Permite peticiones desde tus páginas HTML locales
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuarioLogin) {
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByUsername(usuarioLogin.getUsername());

        if (usuarioEncontrado.isPresent()) {
            Usuario user = usuarioEncontrado.get();
            // Validamos contraseña (en un entorno real se usaría BCrypt, aquí compara directo)
            if (user.getPassword().equals(usuarioLogin.getPassword())) {
                // Retornamos el usuario con su rol (puedes omitir enviar la contraseña por seguridad si gustas)
                user.setPassword(""); 
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
    }
}
