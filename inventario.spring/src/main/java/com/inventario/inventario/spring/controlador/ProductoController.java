/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.inventario.inventario.spring.controlador;
import com.inventario.inventario.spring.model.Producto;
import com.inventario.inventario.spring.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Permite que tu HTML/JS se conecte sin bloqueos de seguridad
public class ProductoController {

    @Autowired
    private ProductoRepository repositorio;

    public ProductoController(ProductoRepository repositorio) {
        this.repositorio = repositorio;
    }

    public ProductoRepository getRepositorio() {
        return repositorio;
    }

    public void setRepositorio(ProductoRepository repositorio) {
        this.repositorio = repositorio;
    }

    // 1. MÉTODO GET: Devuelve todos los productos en formato JSON automáticamente
    @GetMapping
    public List<Producto> listar() {
        return repositorio.findAll();
    }

    // 2. MÉTODO POST: Guarda un producto nuevo enviado desde la web
    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        // Si el código ya existe, lanzamos un error y detenemos el guardado
        if (repositorio.existsByCodigo(producto.getCodigo())) {
            throw new RuntimeException("Código repetido");
        }
        return repositorio.save(producto);
    }
@DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        if (repositorio.existsById(id)) {
            repositorio.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public Producto obtenerPorId(@PathVariable Long id) {
        return repositorio.findById(id).orElse(null);
    }

    // Actualizar un producto existente
    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Long id, @RequestBody Producto producto) {
        // Al enviar el objeto con el ID existente, Spring Boot hace un UPDATE automáticamente
        producto.setIdProducto(id);
        return repositorio.save(producto);
    }
}
