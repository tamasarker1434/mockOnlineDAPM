package com.dapm.ingestion_service.controller;

import com.dapm.ingestion_service.dto.FilterRequestDTO;
import com.dapm.ingestion_service.service.FilterRawEventsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/filter")
@CrossOrigin(origins = "http://localhost:3000")
public class FilterController {

    private final FilterRawEventsService filterRawEventsService;

    public FilterController(FilterRawEventsService filterRawEventsService) {
        this.filterRawEventsService = filterRawEventsService;
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyFilter(@RequestBody FilterRequestDTO request) {
        // Retrieve filter criteria from request
        Map<String, Object> filterCriteria = request.getFilterCriteria();
        return filterRawEventsService.filterRawEvents(filterCriteria);
    }
}
