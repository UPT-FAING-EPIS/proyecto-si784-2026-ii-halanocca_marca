package com.cloudscope.domain.models;

import java.time.Instant;
import java.util.UUID;

public class Project {
    private String id;
    private String name;
    private String description;
    private String version;
    private Object nodes;
    private Object edges;
    private String createdAt;
    private String updatedAt;

    public Project() {
        this.id = "proj_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        this.createdAt = Instant.now().toString();
        this.updatedAt = this.createdAt;
        this.version = "1.0";
    }

    public Project(String id, String name, String description, Object nodes, Object edges) {
        this.id = id != null ? id : "proj_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        this.name = name != null ? name : "Untitled Project";
        this.description = description != null ? description : "";
        this.nodes = nodes;
        this.edges = edges;
        this.version = "1.0";
        this.createdAt = Instant.now().toString();
        this.updatedAt = this.createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public Object getNodes() { return nodes; }
    public void setNodes(Object nodes) { this.nodes = nodes; }

    public Object getEdges() { return edges; }
    public void setEdges(Object edges) { this.edges = edges; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
