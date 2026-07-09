package com.loan.backend.controller;

import com.loan.backend.entity.Document;
import com.loan.backend.entity.DocumentType;
import com.loan.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','LOAN_OFFICER')")
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Document uploadDocument(@RequestParam("documentType") DocumentType documentType, @RequestParam("file") MultipartFile file, Authentication authentication) {
        return documentService.uploadDocument(authentication.getName(), documentType, file
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','LOAN_OFFICER')")
    @GetMapping("/my")
    public List<Document> getMyDocuments(Authentication authentication) {
        return documentService.getDocumentsByUser(authentication.getName());
    }

    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','LOAN_OFFICER')")
    @GetMapping("/download/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) {
        Document meta = documentService.getDocumentMeta(documentId);
        byte[] fileContent = documentService.downloadDocument(documentId);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + meta.getOriginalFileName() + "\"").contentType(MediaType.parseMediaType(meta.getContentType() != null ? meta.getContentType() : "application/octet-stream")).body(fileContent);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @GetMapping("/application/{applicationId}")
    public List<Document> getDocumentsByApplication(
            @PathVariable Long applicationId) {

        return documentService.getDocumentsByApplication(applicationId);
    }
}