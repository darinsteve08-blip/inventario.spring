package com.inventario.inventario.spring.repository;
import com.inventario.inventario.spring.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método para buscar al usuario por su nombre de usuario
    Optional<Usuario> findByUsername(String username);
}
