package com.sgic.employee.server.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sgic.employee.server.entities.Designation;

public interface DesignationRepository extends JpaRepository<Designation, Long> {
	
	Designation findDesignationById(Long id);
	
	List<Designation> findByDesignationNameContaining(String name);

}
