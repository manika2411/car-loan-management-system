package com.loan.backend.service;
import com.loan.backend.entity.EmiSchedule;
import java.util.List;

public interface EmiScheduleService {
    List<EmiSchedule> generateSchedule(Long loanAccountId);
    List<EmiSchedule> getSchedule(Long loanAccountId);
}