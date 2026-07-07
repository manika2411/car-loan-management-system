package com.loan.backend.controller;

import com.loan.backend.entity.Vehicle;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.loan.backend.service.VehicleService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return service.getAllVehicles();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Vehicle createVehicle(
            @RequestBody Vehicle vehicle
    ) {
        return service.createVehicle(vehicle);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Vehicle updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle
    ) {
        return service.updateVehicle(id, vehicle);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        service.deleteVehicle(id);
        return "Vehicle deleted successfully";
    }
}