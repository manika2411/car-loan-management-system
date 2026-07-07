package com.loan.backend.service;

import com.loan.backend.entity.Vehicle;

import java.util.List;

public interface VehicleService {
    Vehicle createVehicle(Vehicle vehicle);
    List<Vehicle> getAllVehicles();
    Vehicle updateVehicle(Long id, Vehicle vehicle);
    void deleteVehicle(Long id);
}