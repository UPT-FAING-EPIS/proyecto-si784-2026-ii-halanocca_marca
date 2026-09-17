package com.cloudscope.infrastructure.adapters.out.persistence.jpa;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "projects")
public class ProjectEntity {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "version", length = 16)
    private String version;

    @Column(name = "nodes_json", columnDefinition = "TEXT")
    private String nodesJson;

    @Column(name = "edges_json", columnDefinition = "TEXT")
    private String edgesJson;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

    public ProjectEntity() {}

    public ProjectEntity(String id, String name, String description, String version, String nodesJson, String edgesJson, String createdAt, String updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.version = version;
        this.nodesJson = nodesJson;
        this.edgesJson = edgesJson;
        this.createdAt = createdAt != null ? createdAt : Instant.now().toString();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now().toString();
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

    public String getNodesJson() { return nodesJson; }
    public void setNodesJson(String nodesJson) { this.nodesJson = nodesJson; }

    public String getEdgesJson() { return edgesJson; }
    public void setEdgesJson(String edgesJson) { this.edgesJson = edgesJson; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
