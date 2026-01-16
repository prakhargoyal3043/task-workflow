package com.prakhar.taskworkflow.repository;

import com.prakhar.taskworkflow.entity.Task;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo(User user);

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByAssignedToAndStatus(User user, TaskStatus status);
}
