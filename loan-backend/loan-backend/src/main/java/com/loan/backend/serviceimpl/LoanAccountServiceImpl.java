package com.loan.backend.serviceimpl;
import com.loan.backend.entity.LoanApplication;
import com.loan.backend.entity.LoanApplicationStatus;
import com.loan.backend.repository.LoanApplicationRepository;
import com.loan.backend.dto.CreateLoanAccountRequest;
import com.loan.backend.entity.LoanAccount;
import com.loan.backend.entity.LoanAccountStatus;
import com.loan.backend.repository.LoanAccountRepository;
import com.loan.backend.service.LoanAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanAccountServiceImpl implements LoanAccountService {
    private final LoanAccountRepository repository;
    private final LoanApplicationRepository applicationRepository;
    @Override
    public LoanAccount createLoanAccount(CreateLoanAccountRequest request) {
        LoanApplication application = applicationRepository.findById(request.getLoanApplicationId()).orElseThrow(() -> new RuntimeException("Application not found"));
        if (application.getStatus() != LoanApplicationStatus.APPROVED) {
            throw new RuntimeException("Only approved applications can create loan accounts");
        }
        LoanAccount account =
                LoanAccount.builder()
                        .accountNumber(
                                "ACC-" + System.currentTimeMillis())
                        .loanApplication(application)
                        .principalAmount(
                                application.getLoanAmount())
                        .interestRate(
                                application.getInterestRate())
                        .tenureMonths(
                                application.getTenureMonths())
                        .outstandingAmount(
                                application.getLoanAmount())
                        .status(
                                LoanAccountStatus.ACTIVE)
                        .createdAt(
                                LocalDateTime.now())
                        .build();
        return repository.save(account);
    }
    @Override
    public List<LoanAccount> getAllLoanAccounts() {
        return repository.findAll();
    }
    @Override
    public LoanAccount getLoanAccount(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Loan Account not found"));
    }

    @Override
    public LoanAccount getLoanAccountByApplicationId(Long applicationId) {
        return repository.findByLoanApplicationId(applicationId).orElseThrow(() -> new RuntimeException("Loan account not found"));
    }

    @Override
    public LoanAccount getLoanAccountByAccountNumber(
            String accountNumber) {
        return repository.findByAccountNumber(accountNumber).orElseThrow(() ->
                        new RuntimeException("Loan account not found"));
    }
}