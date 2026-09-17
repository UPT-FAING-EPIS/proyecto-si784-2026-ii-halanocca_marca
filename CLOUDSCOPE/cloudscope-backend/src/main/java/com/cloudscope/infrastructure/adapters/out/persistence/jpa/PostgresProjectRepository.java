package com.cloudscope.infrastructure.adapters.out.persistence.jpa;

import com.cloudscope.application.ports.out.ProjectRepositoryPort;
import com.cloudscope.domain.models.Project;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@Primary
public class PostgresProjectRepository implements ProjectRepositoryPort {

    private static final Logger log = LoggerFactory.getLogger(PostgresProjectRepository.class);
    private final SpringDataProjectRepository springDataRepository;
    private final ObjectMapper objectMapper;

    public PostgresProjectRepository(SpringDataProjectRepository springDataRepository, ObjectMapper objectMapper) {
        this.springDataRepository = springDataRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public List<Project> findAll() {
        return springDataRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Project> findById(String id) {
        return springDataRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Project save(Project project) {
        if (project.getId() == null || project.getId().isBlank()) {
            project.setId("proj_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        }
        if (project.getCreatedAt() == null || project.getCreatedAt().isBlank()) {
            project.setCreatedAt(Instant.now().toString());
        }
        project.setUpdatedAt(Instant.now().toString());

        ProjectEntity entity = toEntity(project);
        ProjectEntity saved = springDataRepository.save(entity);
        log.info("Project persisted in PostgreSQL: id={}, name={}", saved.getId(), saved.getName());
        return toDomain(saved);
    }

    @Override
    public void deleteById(String id) {
        springDataRepository.deleteById(id);
        log.info("Project deleted from PostgreSQL: id={}", id);
    }

    private Project toDomain(ProjectEntity entity) {
        Project project = new Project();
        project.setId(entity.getId());
        project.setName(entity.getName());
        project.setDescription(entity.getDescription());
        project.setVersion(entity.getVersion());
        project.setCreatedAt(entity.getCreatedAt());
        project.setUpdatedAt(entity.getUpdatedAt());

        try {
            if (entity.getNodesJson() != null && !entity.getNodesJson().isBlank()) {
                project.setNodes(objectMapper.readValue(entity.getNodesJson(), Object.class));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize nodes_json for project {}: {}", entity.getId(), e.getMessage());
        }

        try {
            if (entity.getEdgesJson() != null && !entity.getEdgesJson().isBlank()) {
                project.setEdges(objectMapper.readValue(entity.getEdgesJson(), Object.class));
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize edges_json for project {}: {}", entity.getId(), e.getMessage());
        }

        return project;
    }

    private ProjectEntity toEntity(Project domain) {
        String nodesJson = null;
        String edgesJson = null;

        try {
            if (domain.getNodes() != null) {
                nodesJson = objectMapper.writeValueAsString(domain.getNodes());
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize nodes for project {}: {}", domain.getId(), e.getMessage());
        }

        try {
            if (domain.getEdges() != null) {
                edgesJson = objectMapper.writeValueAsString(domain.getEdges());
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize edges for project {}: {}", domain.getId(), e.getMessage());
        }

        return new ProjectEntity(
                domain.getId(),
                domain.getName(),
                domain.getDescription(),
                domain.getVersion(),
                nodesJson,
                edgesJson,
                domain.getCreatedAt(),
                domain.getUpdatedAt()
        );
    }
}
