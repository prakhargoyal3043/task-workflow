package com.prakhar.taskworkflow.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.prakhar.taskworkflow.dto.DashboardResponse;
import com.prakhar.taskworkflow.entity.Task;
import com.prakhar.taskworkflow.entity.TaskStatus;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.repository.TaskRepository;
import com.prakhar.taskworkflow.repository.UserRepository;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public DashboardService(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ADMIN Dashboard
    public DashboardResponse getAdminDashboard() {
        Map<String, Long> summary = new HashMap<>();
        long totalUsers = userRepository.count();
        long totalTasks = taskRepository.count();
        long pendingApprovals = taskRepository.findByStatus(TaskStatus.TODO).size();

        summary.put("totalUsers", totalUsers);
        summary.put("totalTasks", totalTasks);
        summary.put("pendingApprovals", pendingApprovals);

        // Optional: tasks per user
        Map<String, Long> taskByUser = taskRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        t -> t.getAssignedTo().getName(),
                        Collectors.counting()
                ));

        return new DashboardResponse(summary, taskByUser);
    }

    // MANAGER Dashboard
    public DashboardResponse getManagerDashboard() {
        User manager = getCurrentUser();

        Map<String, Long> summary = new HashMap<>();
        long pendingApprovals = taskRepository.findByStatus(TaskStatus.TODO).size();
        long inProgress = taskRepository.findByStatus(TaskStatus.IN_PROGRESS).size();

        summary.put("pendingApprovals", pendingApprovals);
        summary.put("inProgressTasks", inProgress);

        // Tasks by user
        Map<String, Long> taskByUser = taskRepository.findAll().stream()
                .filter(t -> t.getAssignedTo() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getAssignedTo().getName(),
                        Collectors.counting()
                ));

        return new DashboardResponse(summary, taskByUser);
    }

    // USER Dashboard
    public DashboardResponse getUserDashboard() {
        User user = getCurrentUser();

        List<Task> myTasks = taskRepository.findByAssignedTo(user);
        Map<TaskStatus, Long> summary =
                myTasks.stream()
                        .collect(Collectors.groupingBy(
                                Task::getStatus,
                                Collectors.counting()
                        ));

        return new DashboardResponse(summary, null);
    }
}
