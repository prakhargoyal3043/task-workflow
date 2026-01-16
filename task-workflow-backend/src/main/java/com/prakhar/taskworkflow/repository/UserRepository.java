package com.prakhar.taskworkflow.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.prakhar.taskworkflow.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    Page<User> findAllByDeletedFalse(Pageable pageable);
    
    @Query("""
    	    SELECT DISTINCT u
    	    FROM User u
    	    JOIN u.roles r
    	    WHERE u.deleted = false
    	      AND r.name = :roleName
    	""")
    	Page<User> findAllActiveUsersByRole(
    	        @Param("roleName") String roleName,
    	        Pageable pageable
    	);
}
