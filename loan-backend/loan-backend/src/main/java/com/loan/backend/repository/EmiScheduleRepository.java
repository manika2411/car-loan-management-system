package com.loan.backend.repository;
import com.loan.backend.entity.EmiSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EmiScheduleRepository extends JpaRepository<EmiSchedule, Long> {
    List<EmiSchedule> findByLoanAccountId(Long loanAccountId);
}