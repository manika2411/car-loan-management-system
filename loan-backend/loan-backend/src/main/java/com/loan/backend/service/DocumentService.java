package com.loan.backend.service;

import com.loan.backend.entity.Document;
import com.loan.backend.entity.DocumentType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    Document uploadDocument(String email, DocumentType documentType, MultipartFile file);
    List<Document> getDocumentsByUser(String email);
    byte[] downloadDocument(Long documentId);
    Document getDocumentMeta(Long documentId);
    List<Document> getAllDocuments();
    List<Document> getDocumentsByApplication(Long applicationId);
}