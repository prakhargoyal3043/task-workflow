package com.prakhar.taskworkflow.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prakhar.taskworkflow.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	 Role findByName(String name);
    Set<Role> findByNameIn(Set<String> names);

}
