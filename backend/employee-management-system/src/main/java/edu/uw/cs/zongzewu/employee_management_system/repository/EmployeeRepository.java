package edu.uw.cs.zongzewu.employee_management_system.repository;

import edu.uw.cs.zongzewu.employee_management_system.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    List<Employee> findByDepartmentId(Long departmentId);

    List<Employee> findByStatus(Employee.EmployeeStatus status);

    @Query("SELECT e FROM Employee AS e WHERE "
            + "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR "
            + "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :name, '%')) ")
    List<Employee> findByNameContaining(@Param("name") String name);

    List<Employee> findByPositionContainingIgnoreCase(String position);

    @Query("SELECT COUNT(e) FROM Employee AS e WHERE e.department.id = :departmentId")
    Long countByDepartmentId(@Param("departmentId") Long departmentId);

    List<Employee> findByDepartmentIsNull();
}
