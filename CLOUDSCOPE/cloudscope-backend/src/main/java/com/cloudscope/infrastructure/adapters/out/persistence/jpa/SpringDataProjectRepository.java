package com.cloudscope.infrastructure.adapters.out.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataProjectRepository extends JpaRepository<ProjectEntity, String> {
}
