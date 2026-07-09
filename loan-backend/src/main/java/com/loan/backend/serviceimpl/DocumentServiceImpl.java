package com.loan.backend.serviceimpl;

import com.loan.backend.entity.Document;
import com.loan.backend.entity.DocumentType;
import com.loan.backend.entity.LoanApplication;
import com.loan.backend.repository.DocumentRepository;
import com.loan.backend.repository.LoanApplicationRepository;
import com.loan.backend.service.DocumentService;
import com.loan.backend.entity.User;
import com.loan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    @Value("${app.upload.dir}")
    private String uploadDir;
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"
    );

    @Override
    public Document uploadDocument(String email, DocumentType documentType, MultipartFile file) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (file.isEmpty()) {throw new RuntimeException(
                    "Cannot upload an empty file");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new RuntimeException(
                    "Only JPG, PNG and PDF files are allowed"
            );
        }

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFileName = file.getOriginalFilename();
            String extension = "";

            if (originalFileName != null &&
                    originalFileName.contains(".")) {

                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String storedFileName = UUID.randomUUID() + extension;
            Path targetPath = uploadPath.resolve(storedFileName);
            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );
            Document document =
                    Document.builder()
                            .originalFileName(originalFileName)
                            .storedFileName(storedFileName)
                            .filePath(targetPath.toString())
                            .documentType(documentType)
                            .contentType(contentType)
                            .fileSize(file.getSize())
                            .user(user)
                            .build();
            return documentRepository.save(document);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file: " + ex.getMessage()
            );
        }
    }

    @Override
    public List<Document> getDocumentsByUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return documentRepository.findByUserId(
                user.getId()
        );
    }

    @Override
    public byte[] downloadDocument(
            Long documentId
    ) {
        Document document = getDocumentMeta(documentId);
        try {
            return Files.readAllBytes(Paths.get(document.getFilePath()));

        } catch (IOException ex) {
            throw new RuntimeException("Failed to read file: " + ex.getMessage()
            );
        }
    }

    @Override
    public Document getDocumentMeta(
            Long documentId
    ) {
        return documentRepository.findById(documentId).orElseThrow(() -> new RuntimeException("Document not found"));
    }

    @Override
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @Override
    public List<Document> getDocumentsByApplication(Long applicationId) {
        LoanApplication application = loanApplicationRepository
                .findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        return documentRepository.findByUserId(
                application.getUser().getId()
        );
    }
}