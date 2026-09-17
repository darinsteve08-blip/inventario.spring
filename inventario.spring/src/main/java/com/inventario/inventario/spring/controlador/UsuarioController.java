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

    // Ruta para listar usuarios (soluciona el error 404 del /index)
    @GetMapping("/index")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuarioLogin) {
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByUsername(usuarioLogin.getUsername());

        if (usuarioEncontrado.isPresent()) {
            Usuario user = usuarioEncontrado.get();
            if (user.getPassword().equals(usuarioLogin.getPassword())) {
                user.setPassword(""); 
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        usuario.setRol("OPERARIO");
        usuarioRepository.save(usuario); // Guardado real en la base de datos de Railway
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
