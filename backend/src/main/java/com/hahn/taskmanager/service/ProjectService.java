package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.ProjectRequest;
import com.hahn.taskmanager.dto.ProjectResponse;
import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.exception.ResourceNotFoundException;
import com.hahn.taskmanager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, User owner) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .owner(owner)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(User owner) {
        return projectRepository.findByOwnerOrderByCreatedAtDesc(owner)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAllProjectsPaginated(User owner, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findByOwnerOrderByCreatedAtDesc(owner, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, User owner) {
        Project project = projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Transactional(readOnly = true)
    public Project getProjectEntityById(Long id, User owner) {
        return projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, User owner) {
        Project project = projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    @Transactional
    public void deleteProject(Long id, User owner) {
        Project project = projectRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> searchProjects(User owner, String search) {
        return projectRepository.searchByTitle(owner, search)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .totalTasks(project.getTotalTasks())
                .completedTasks(project.getCompletedTasks())
                .progressPercentage(project.getProgressPercentage())
                .build();
    }
}
