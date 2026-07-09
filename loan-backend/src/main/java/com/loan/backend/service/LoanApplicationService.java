package com.loan.backend.service;

import com.loan.backend.dto.CreateLoanApplicationRequest;
import com.loan.backend.entity.LoanApplication;
import java.util.List;

public interface LoanApplicationService {
    LoanApplication createApplication(
            CreateLoanApplicationRequest request);

    List<LoanApplication> getAllApplications();
    LoanApplication getApplication(Long id);
    LoanApplication reviewApplication(Long id);
    LoanApplication approveApplication(Long id);
    LoanApplication rejectApplication(Long id);
    List<LoanApplication> getMyApplications();
}