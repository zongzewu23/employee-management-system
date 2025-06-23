package edu.uw.cs.zongzewu.employee_management_system.repository;

import edu.uw.cs.zongzewu.employee_management_system.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Optional<Department> findByName(String name);

    List<Department> findByNameContainingIgnoreCase(String name);

    List<Department> findByLocationContainingIgnoreCase(String location);

    List<Department> findByManagerNameContainingIgnoreCase(String managerName);

    @Query("SELECT DISTINCT d FROM Department d WHERE SIZE(d.employees) > 0")
    List<Department> findDepartmentsWithEmployees();

    @Query("SELECT d FROM Department d WHERE SIZE(d.employees) = 0")
    List<Department> findEmptyDepartments();

}
