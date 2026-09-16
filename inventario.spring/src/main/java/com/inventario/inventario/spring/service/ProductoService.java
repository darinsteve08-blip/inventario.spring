package com.inventario.inventario.spring.service;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.inventario.inventario.spring.repository.ProductoRepository;
import com.inventario.inventario.spring.model.Producto;

@Service 
public class ProductoService {
    private final ProductoRepository repository;
    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }
    public List<Producto> listarProductos() {
        return repository.findAll();
    }
    public Producto guardarProducto(Producto producto) {
        return repository.save(producto);
    }
    public Optional<Producto> buscarPorId(Long id) {
        return repository.findById(id);
    }
}

