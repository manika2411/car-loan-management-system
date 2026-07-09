package com.loan.backend.serviceimpl;

import com.loan.backend.service.VehicleService;
import com.loan.backend.entity.Vehicle;
import com.loan.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository repository;

    @Override
    public Vehicle createVehicle(Vehicle vehicle) {
        return repository.save(vehicle);
    }

    @Override
    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }

    @Override
    public Vehicle updateVehicle(Long id, Vehicle vehicle) {
        Vehicle existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found: " + id));

        existing.setBrand(vehicle.getBrand());
        existing.setModel(vehicle.getModel());
        existing.setVariant(vehicle.getVariant());
        existing.setPrice(vehicle.getPrice());
        existing.setInterestRate(vehicle.getInterestRate());

        if (vehicle.getActive() != null) {
            existing.setActive(vehicle.getActive());
        }
        return repository.save(existing);
    }

    @Override
    public void deleteVehicle(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Vehicle not found: " + id);
        }
        repository.deleteById(id);
    }
}