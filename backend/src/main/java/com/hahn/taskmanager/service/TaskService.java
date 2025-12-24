package com.hahn.taskmanager.service;

import com.hahn.taskmanager.dto.TaskRequest;
import com.hahn.taskmanager.dto.TaskResponse;
import com.hahn.taskmanager.entity.Project;
import com.hahn.taskmanager.entity.Task;
import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.exception.ResourceNotFoundException;
import com.hahn.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    @Transactional
    public TaskResponse createTask(Long projectId, TaskRequest request, User owner) {
        Project project = projectService.getProjectEntityById(projectId, owner);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .completed(false)
                .project(project)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(Long projectId, User owner) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        return taskRepository.findByProjectOrderByCreatedAtDesc(project)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasksPaginated(Long projectId, User owner, int page, int size) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        Pageable pageable = PageRequest.of(page, size);
        return taskRepository.findByProjectOrderByCreatedAtDesc(project, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long projectId, Long taskId, User owner) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long projectId, Long taskId, TaskRequest request, User owner) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Transactional
    public TaskResponse toggleTaskCompletion(Long projectId, Long taskId, User owner) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        task.setCompleted(!task.isCompleted());
        if (task.isCompleted()) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(Long projectId, Long taskId, User owner) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        Task task = taskRepository.findByIdAndProject(taskId, project)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));
        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> searchTasks(Long projectId, User owner, String search) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        return taskRepository.searchByTitle(project, search)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStatus(Long projectId, User owner, boolean completed) {
        Project project = projectService.getProjectEntityById(projectId, owner);
        return taskRepository.findByProjectAndCompleted(project, completed)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .completed(task.isCompleted())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .completedAt(task.getCompletedAt())
                .projectId(task.getProject().getId())
                .build();
    }
}
