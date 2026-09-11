package com.cloudscope.application.services;

import com.cloudscope.application.ports.in.ProjectUseCase;
import com.cloudscope.application.ports.out.ProjectRepositoryPort;
import com.cloudscope.domain.models.Project;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService implements ProjectUseCase {

    private final ProjectRepositoryPort repository;

    public ProjectService(ProjectRepositoryPort repository) {
        this.repository = repository;
    }

    @Override
    public List<Project> getAllProjects() {
        return repository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(String id) {
        return repository.findById(id);
    }

    @Override
    public Project saveProject(Project project) {
        return repository.save(project);
    }

    @Override
    public void deleteProject(String id) {
        repository.deleteById(id);
    }
}
