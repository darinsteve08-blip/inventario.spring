package com.inventario.inventario.spring;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import com.inventario.inventario.spring.repository.ProductoRepository;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
	@Bean 
	CommandLineRunner probarRepositorio(ProductoRepository repositorio) {
		return args -> {
			System.out.println("Productos Registrados:");
			repositorio.findAll().forEach(producto -> {
				System.out.println(producto.getNombre());
			});
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
