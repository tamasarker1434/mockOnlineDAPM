package com.dapm.ingestion_service.controller;

import com.dapm.ingestion_service.dto.FilterIngestionRequestDTO;
import com.dapm.ingestion_service.service.FilterIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/filter")
@CrossOrigin(origins = "http://localhost:3000")
public class FilterIngestionController {

    private final FilterIngestionService filterIngestionService;

    public FilterIngestionController(FilterIngestionService filterIngestionService) {
        this.filterIngestionService = filterIngestionService;
    }


    @PostMapping("/start")
    public ResponseEntity<String> startFilterIngestion(@RequestBody FilterIngestionRequestDTO request) {
        filterIngestionService.startFilterIngestion(request.getUrl(), request.getFilterCriteria());
        return ResponseEntity.ok("Started ingestion & filtering from URL: " + request.getUrl());
    }
}
