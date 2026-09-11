package com.cloudscope.infrastructure.adapters.in.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173") // Permitir peticiones desde tu frontend en Vite
public class ProjectController {

    // RF-09: Endpoint para guardar el estado del diagrama
    @PostMapping("/{projectId}/save")
    public ResponseEntity<?> saveDiagram(@PathVariable Long projectId, @RequestBody Object diagramData) {
        // Aquí irá la lógica para guardar en PostgreSQL usando un Repository
        System.out.println("Guardando diagrama para proyecto " + projectId);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Arquitectura guardada correctamente.");
        return ResponseEntity.ok(response);
    }

    // RF-05: Endpoint simulado para estimar costos (FinOps)
    @PostMapping("/estimate-cost")
    public ResponseEntity<?> estimateCost(@RequestBody Object diagramNodes) {
        // Aquí implementarás la lógica que lee los nodos (ej. EC2, RDS) y consulta tu catálogo de precios
        Map<String, Object> costEstimate = new HashMap<>();
        costEstimate.put("estimatedMonthlyCostUSD", 145.50);
        costEstimate.put("currency", "USD");
        return ResponseEntity.ok(costEstimate);
    }
}
