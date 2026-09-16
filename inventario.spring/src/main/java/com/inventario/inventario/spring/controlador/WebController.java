package com.inventario.inventario.spring.controlador;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    // Cuando alguien entre a la raíz de la app, lo mandamos al login
    @GetMapping("/")
    public String raiz() {
        return "forward:/login.html";
    }
}
