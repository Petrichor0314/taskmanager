package com.hahn.taskmanager.controller;

import com.hahn.taskmanager.dto.TaskRequest;
import com.hahn.taskmanager.dto.TaskResponse;
import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user
    ) {
        return new ResponseEntity<>(taskService.createTask(projectId, request, user), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(taskService.getAllTasks(projectId, user));
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<TaskResponse>> getAllTasksPaginated(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(taskService.getAllTasksPaginated(projectId, user, page, size));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(taskService.getTaskById(projectId, taskId, user));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @Valid @RequestBody TaskRequest request,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(taskService.updateTask(projectId, taskId, request, user));
    }

    @PatchMapping("/{taskId}/toggle")
    public ResponseEntity<TaskResponse> toggleTaskCompletion(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(taskService.toggleTaskCompletion(projectId, taskId, user));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @AuthenticationPrincipal User user
    ) {
        taskService.deleteTask(projectId, taskId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> searchTasks(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user,
            @RequestParam String q
    ) {
        return ResponseEntity.ok(taskService.searchTasks(projectId, user, q));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @PathVariable Long projectId,
            @AuthenticationPrincipal User user,
            @RequestParam boolean completed
    ) {
        return ResponseEntity.ok(taskService.getTasksByStatus(projectId, user, completed));
    }
}
