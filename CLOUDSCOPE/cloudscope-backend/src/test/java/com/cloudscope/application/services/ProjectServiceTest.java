package com.cloudscope.application.services;

import com.cloudscope.application.ports.out.ProjectRepositoryPort;
import com.cloudscope.domain.models.Project;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {
    @Test
    void savedGraphCanBeRecoveredThroughTheUseCase() {
        var repository = mock(ProjectRepositoryPort.class);
        var service = new ProjectService(repository);
        var project = new Project("p1", "Architecture", "Test", List.of("node"), List.of());
        when(repository.save(project)).thenReturn(project);
        when(repository.findById("p1")).thenReturn(Optional.of(project));
        assertSame(project, service.saveProject(project));
        assertEquals(project.getNodes(), service.getProjectById("p1").orElseThrow().getNodes());
        verify(repository).save(project);
    }

    @Test
    void unknownProjectIsEmptyAndDeletionTargetsOnlyRequestedId() {
        var repository = mock(ProjectRepositoryPort.class);
        var service = new ProjectService(repository);
        when(repository.findById("missing")).thenReturn(Optional.empty());
        assertTrue(service.getProjectById("missing").isEmpty());
        service.deleteProject("p1");
        verify(repository).deleteById("p1");
        verify(repository, never()).deleteById("other");
    }
}
