package com.cloudscope.infrastructure.adapters.out.persistence;

import com.cloudscope.application.ports.out.ProjectRepositoryPort;
import com.cloudscope.domain.models.Project;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryProjectRepository implements ProjectRepositoryPort {

    private final Map<String, Project> store = new ConcurrentHashMap<>();

    @Override
    public List<Project> findAll() {
        return new ArrayList<>(store.values());
    }

    @Override
    public Optional<Project> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public Project save(Project project) {
        if (project.getId() == null) {
            project.setId("proj_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        }
        store.put(project.getId(), project);
        return project;
    }

    @Override
    public void deleteById(String id) {
        store.remove(id);
    }
}
