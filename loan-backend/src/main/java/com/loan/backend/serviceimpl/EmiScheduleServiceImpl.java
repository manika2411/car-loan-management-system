package com.loan.backend.serviceimpl;

import com.loan.backend.entity.EmiSchedule;
import com.loan.backend.entity.PaymentStatus;
import com.loan.backend.repository.EmiScheduleRepository;
import com.loan.backend.entity.LoanAccount;
import com.loan.backend.repository.LoanAccountRepository;
import com.loan.backend.service.EmiScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmiScheduleServiceImpl implements EmiScheduleService {
    private final EmiScheduleRepository repository;
    private final LoanAccountRepository loanAccountRepository;

    @Override
    public List<EmiSchedule> generateSchedule(Long loanAccountId) {
        LoanAccount account = loanAccountRepository.findById(loanAccountId)
                .orElseThrow(() -> new RuntimeException("Loan Account not found"));

        List<EmiSchedule> schedules = new ArrayList<>();
        BigDecimal balance = account.getPrincipalAmount();
        BigDecimal emi = account.getLoanApplication().getMonthlyEmi();
        BigDecimal monthlyRate = BigDecimal.valueOf(account.getInterestRate())
                .divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);

        for (int i = 1; i <= account.getTenureMonths(); i++) {
            BigDecimal interestComponent = balance.multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);
            BigDecimal principalComponent = emi.subtract(interestComponent)
                    .setScale(2, RoundingMode.HALF_UP);
            balance = balance.subtract(principalComponent);

            EmiSchedule schedule = EmiSchedule.builder()
                    .installmentNumber(i)
                    .dueDate(LocalDate.now().plusMonths(i))
                    .emiAmount(emi)
                    .principalComponent(principalComponent)
                    .interestComponent(interestComponent)
                    .balanceAmount(balance.max(BigDecimal.ZERO))
                    .paymentStatus(PaymentStatus.PENDING)
                    .loanAccount(account)
                    .build();
            schedules.add(schedule);
        }
        return repository.saveAll(schedules);
    }

    @Override
    public List<EmiSchedule> getSchedule(Long loanAccountId) {
        return repository.findByLoanAccountId(loanAccountId);
    }
}