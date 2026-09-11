package com.cloudscope.application.ports.in;

import com.cloudscope.domain.models.Project;
import java.util.List;
import java.util.Optional;

public interface ProjectUseCase {
    List<Project> getAllProjects();
    Optional<Project> getProjectById(String id);
    Project saveProject(Project project);
    void deleteProject(String id);
}
