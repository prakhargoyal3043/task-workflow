package com.prakhar.taskworkflow.service;

import com.prakhar.taskworkflow.dto.TaskRequest;
import com.prakhar.taskworkflow.dto.TaskResponse;
import com.prakhar.taskworkflow.dto.TaskStatusRequest;
import com.prakhar.taskworkflow.entity.Task;
import com.prakhar.taskworkflow.entity.TaskStatus;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.repository.TaskRepository;
import com.prakhar.taskworkflow.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public void createTask(TaskRequest request) {

        User creator = getCurrentUser();
        User assignedUser = userRepository.findById(request.getAssignedUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setCreatedBy(creator);
        task.setAssignedTo(assignedUser);
        task.setStatus(TaskStatus.TODO);

        taskRepository.save(task);
    }

    public List<Task> getMyTasks() {
        return taskRepository.findByAssignedTo(getCurrentUser());
    }

    public void updateTaskStatus(Long taskId, TaskStatusRequest request) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(request.getStatus());
        taskRepository.save(task);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    
    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setStatus(task.getStatus().name());

        response.setAssignedTo(
                task.getAssignedTo() != null
                        ? task.getAssignedTo().getName()
                        : null
        );

        response.setCreatedBy(
                task.getCreatedBy() != null
                        ? task.getCreatedBy().getName()
                        : null
        );

        return response;
    }
}
