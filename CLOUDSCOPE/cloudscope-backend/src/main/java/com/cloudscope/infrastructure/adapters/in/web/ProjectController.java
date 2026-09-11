package com.cloudscope.infrastructure.adapters.in.web;

import com.cloudscope.application.ports.in.ProjectUseCase;
import com.cloudscope.domain.models.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:80", "http://localhost:3000", "*"})
public class ProjectController {

    private final ProjectUseCase projectUseCase;

    public ProjectController(ProjectUseCase projectUseCase) {
        this.projectUseCase = projectUseCase;
    }

    // Listar todos los proyectos
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectUseCase.getAllProjects());
    }

    // Obtener un proyecto por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable String id) {
        return projectUseCase.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Crear o actualizar un proyecto
    @PostMapping
    public ResponseEntity<Project> saveProject(@RequestBody Project project) {
        Project saved = projectUseCase.saveProject(project);
        return ResponseEntity.ok(saved);
    }

    // Eliminar un proyecto
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id) {
        projectUseCase.deleteProject(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Proyecto eliminado correctamente.");
        return ResponseEntity.ok(response);
    }

    // RF-09: Endpoint para guardar el estado del diagrama
    @PostMapping("/{projectId}/save")
    public ResponseEntity<?> saveDiagram(@PathVariable String projectId, @RequestBody Map<String, Object> diagramData) {
        Project project = projectUseCase.getProjectById(projectId)
                .orElseGet(() -> new Project(projectId, (String) diagramData.getOrDefault("name", "Proyecto CloudScope"), "", null, null));

        if (diagramData.containsKey("nodes")) {
            project.setNodes(diagramData.get("nodes"));
        }
        if (diagramData.containsKey("edges")) {
            project.setEdges(diagramData.get("edges"));
        }
        if (diagramData.containsKey("name")) {
            project.setName((String) diagramData.get("name"));
        }
        if (diagramData.containsKey("description")) {
            project.setDescription((String) diagramData.get("description"));
        }

        Project saved = projectUseCase.saveProject(project);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Arquitectura guardada correctamente.");
        response.put("project", saved);
        return ResponseEntity.ok(response);
    }

    // RF-05: Endpoint para estimar costos (FinOps)
    @PostMapping("/estimate-cost")
    public ResponseEntity<?> estimateCost(@RequestBody Map<String, Object> request) {
        Map<String, Object> costEstimate = new HashMap<>();
        costEstimate.put("status", "success");
        costEstimate.put("currency", "USD");
        costEstimate.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(costEstimate);
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "cloudscope-backend");
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(health);
    }
}
