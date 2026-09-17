package com.inventario.inventario.spring.model;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    private String username;
    private String password;
    private String rol;
    private String email;

    // Constructores
    public Usuario() {}

    public Usuario(String username, String password, String rol, String email) {
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.email = email;
    }

    // Getters y Setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}
}