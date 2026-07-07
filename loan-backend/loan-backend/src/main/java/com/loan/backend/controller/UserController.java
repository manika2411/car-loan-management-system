package com.loan.backend.controller;

import com.loan.backend.entity.Role;
import com.loan.backend.entity.User;
import com.loan.backend.repository.RoleRepository;
import com.loan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @GetMapping("/me")
    public Map<String, Object> me(
            Authentication authentication) {
        Map<String, Object> response =new HashMap<>();
        response.put("email", authentication.getName());
        response.put("roles", authentication.getAuthorities());
        return response;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/role")
    public User updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleName = body.get("role");

        if (roleName == null || roleName.isBlank()) {
            throw new IllegalArgumentException("role is required");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        return userRepository.save(user);
    }
}