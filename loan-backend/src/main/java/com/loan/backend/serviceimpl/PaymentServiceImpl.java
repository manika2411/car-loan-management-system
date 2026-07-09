package com.loan.backend.serviceimpl;

import com.loan.backend.entity.EmiSchedule;
import com.loan.backend.entity.PaymentStatus;
import com.loan.backend.repository.EmiScheduleRepository;
import com.loan.backend.entity.LoanAccount;
import com.loan.backend.repository.LoanAccountRepository;
import com.loan.backend.dto.PaymentRequest;
import com.loan.backend.entity.Payment;
import com.loan.backend.repository.PaymentRepository;
import com.loan.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final EmiScheduleRepository emiRepository;
    private final LoanAccountRepository loanAccountRepository;
    @Override
    public Payment payEmi(Long emiId, PaymentRequest request) {
        EmiSchedule emi = emiRepository.findById(emiId).orElseThrow(() -> new RuntimeException("EMI not found"));
        if (emi.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("EMI already paid");
        }
        emi.setPaymentStatus(PaymentStatus.PAID);
        emiRepository.save(emi);
        LoanAccount account = emi.getLoanAccount();
        account.setOutstandingAmount(account.getOutstandingAmount().subtract(request.getAmountPaid()));
        loanAccountRepository.save(account);
        Payment payment = Payment.builder().emiSchedule(emi)
                        .amountPaid(
                                request.getAmountPaid())
                        .paymentMethod(
                                request.getPaymentMethod())
                        .transactionReference(
                                request.getTransactionReference())
                        .paymentDate(
                                LocalDateTime.now())
                        .build();
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public List<Payment> getMyPayments(String email) {
        List<Payment> payments = paymentRepository.findAll();
        payments.forEach(p -> {System.out.println(p.getEmiSchedule().getLoanAccount().getLoanApplication().getUser());
        });
        return paymentRepository.findByCustomerEmail(email);
    }
}