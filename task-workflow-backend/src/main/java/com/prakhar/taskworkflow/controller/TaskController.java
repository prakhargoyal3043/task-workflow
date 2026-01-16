package com.prakhar.taskworkflow.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.prakhar.taskworkflow.dto.TaskRequest;
import com.prakhar.taskworkflow.dto.TaskStatusRequest;
import com.prakhar.taskworkflow.entity.TaskStatus;
import com.prakhar.taskworkflow.service.TaskService;
import com.prakhar.taskworkflow.dto.TaskResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Only ADMIN or MANAGER can create tasks
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @PostMapping
    public ResponseEntity<String> createTask(@Valid @RequestBody TaskRequest request) {
        taskService.createTask(request);
        return ResponseEntity.ok("Task created successfully");
    }

    // Any authenticated user can see their own tasks
    @PreAuthorize("hasRole('USER') or hasRole('MANAGER') or hasRole('ADMIN')")
    @GetMapping("/my")    
    public ResponseEntity<?> getMyTasks() {
        return ResponseEntity.ok(taskService.getMyTasks());
    }

    // Only MANAGER can approve/reject tasks
    @PreAuthorize("hasAnyRole('MANAGER','USER')")
    @PutMapping("/{taskId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusRequest request) {

        taskService.updateTaskStatus(taskId, request);
        return ResponseEntity.ok("Task status updated");
    }
    
 // ✅ ADMIN / MANAGER – get tasks by status
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER','USER')")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @RequestParam(required = false) TaskStatus status
    ) {
        if (status == null) {
            return ResponseEntity.ok(taskService.getAllTasks());
        }
        return ResponseEntity.ok(taskService.getTasksByStatus(status));
    }
}
