package com.cloudscope.application.ports.out;

import com.cloudscope.domain.models.Project;
import java.util.List;
import java.util.Optional;

public interface ProjectRepositoryPort {
    List<Project> findAll();
    Optional<Project> findById(String id);
    Project save(Project project);
    void deleteById(String id);
}
