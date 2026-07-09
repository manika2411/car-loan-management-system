package com.loan.backend.serviceimpl;

import com.loan.backend.dto.CreateLoanAccountRequest;
import com.loan.backend.dto.CreateLoanApplicationRequest;
import com.loan.backend.entity.*;
import com.loan.backend.repository.LeadRepository;
import com.loan.backend.repository.LoanApplicationRepository;
import com.loan.backend.repository.UserRepository;
import com.loan.backend.service.EmiScheduleService;
import com.loan.backend.service.LoanAccountService;
import com.loan.backend.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationServiceImpl implements LoanApplicationService {

    private final LoanApplicationRepository repository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final LoanAccountService loanAccountService;
    private final EmiScheduleService emiScheduleService;

    @Override
    public LoanApplication createApplication(CreateLoanApplicationRequest request) {

        Lead lead = null;

        if (request.getLeadId() != null) {
            lead = leadRepository.findById(request.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double principal = request.getLoanAmount().doubleValue();
        double annualRate = request.getInterestRate();
        int tenure = request.getTenureMonths();

        double monthlyRate = annualRate / 12 / 100;

        double emiValue =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure))
                        / (Math.pow(1 + monthlyRate, tenure) - 1);

        BigDecimal emi = BigDecimal.valueOf(emiValue)
                .setScale(2, RoundingMode.HALF_UP);

        LoanApplication application = LoanApplication.builder()
                .user(user)
                .lead(lead)
                .vehicleName(request.getVehicleName())
                .vehiclePrice(request.getVehiclePrice())
                .downPayment(request.getDownPayment())
                .loanAmount(request.getLoanAmount())
                .interestRate(request.getInterestRate())
                .tenureMonths(request.getTenureMonths())
                .monthlyEmi(emi)
                .build();

        return repository.save(application);
    }

    @Override
    public List<LoanApplication> getAllApplications() {
        return repository.findAll();
    }

    @Override
    public LoanApplication getApplication(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Override
    public LoanApplication reviewApplication(Long id) {

        LoanApplication application = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != LoanApplicationStatus.SUBMITTED) {
            throw new RuntimeException(
                    "Only submitted applications can be moved to review.");
        }

        application.setStatus(LoanApplicationStatus.UNDER_REVIEW);

        return repository.save(application);
    }

    @Override
    public LoanApplication approveApplication(Long id) {

        LoanApplication application = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != LoanApplicationStatus.UNDER_REVIEW) {
            throw new RuntimeException(
                    "Application must be under review before approval.");
        }

        application.setStatus(LoanApplicationStatus.APPROVED);

        LoanApplication savedApplication = repository.save(application);

        CreateLoanAccountRequest request = new CreateLoanAccountRequest();
        request.setLoanApplicationId(savedApplication.getId());

        LoanAccount account = loanAccountService.createLoanAccount(request);

        emiScheduleService.generateSchedule(account.getId());

        return savedApplication;
    }

    @Override
    public LoanApplication rejectApplication(Long id) {

        LoanApplication application = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (application.getStatus() != LoanApplicationStatus.UNDER_REVIEW) {
            throw new RuntimeException(
                    "Application must be under review before rejection.");
        }

        application.setStatus(LoanApplicationStatus.REJECTED);

        return repository.save(application);
    }

    @Override
    public List<LoanApplication> getMyApplications() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return repository.findByUserId(user.getId());
    }
}