package com.hahn.taskmanager.repository;

import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectOrderByCreatedAtDesc(Project project);
    
    Page<Task> findByProjectOrderByCreatedAtDesc(Project project, Pageable pageable);
    
    Optional<Task> findByIdAndProject(Long id, Project project);
    
    @Query("SELECT t FROM Task t WHERE t.project = :project AND LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Task> searchByTitle(@Param("project") Project project, @Param("search") String search);
    
    @Query("SELECT t FROM Task t WHERE t.project = :project AND t.completed = :completed")
    List<Task> findByProjectAndCompleted(@Param("project") Project project, @Param("completed") boolean completed);
    
    long countByProject(Project project);
    
    long countByProjectAndCompleted(Project project, boolean completed);
}
