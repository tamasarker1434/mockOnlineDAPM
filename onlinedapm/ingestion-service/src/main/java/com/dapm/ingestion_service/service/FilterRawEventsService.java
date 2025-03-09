package com.dapm.ingestion_service.service;

import com.dapm.ingestion_service.entity.FilteredEvent;
import com.dapm.ingestion_service.entity.IngestedEvent;
import com.dapm.ingestion_service.repository.FilteredEventRepository;
import com.dapm.ingestion_service.repository.IngestedEventRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FilterRawEventsService {
    private static final Logger logger = LoggerFactory.getLogger(FilterRawEventsService.class);
    private final WebClient.Builder webClientBuilder;
    private final FilteredEventRepository filteredEventRepository;
    private final IngestedEventRepository ingestedEventRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public FilterRawEventsService(WebClient.Builder webClientBuilder,
                                  FilteredEventRepository filteredEventRepository,
                                  IngestedEventRepository ingestedEventRepository,
                                  SimpMessagingTemplate messagingTemplate) {
        this.webClientBuilder = webClientBuilder;
        this.filteredEventRepository = filteredEventRepository;
        this.ingestedEventRepository = ingestedEventRepository;
    }

    public ResponseEntity<String> filterRawEvents(Map<String, Object> filterCriteria) {
        // Fetch all ingested events from MongoDB (ingested_events collection)
        List<IngestedEvent> allEvents = ingestedEventRepository.findAll();

        // Filter events based on the criteria.
        // Since the actual event details are inside the "event" field (a JSON string)
        // we parse that string and check for each criteria.
        List<IngestedEvent> matchedEvents = allEvents.stream()
                .filter(event -> matchesFilter(event.getRawData(), filterCriteria))
                .collect(Collectors.toList());

        // Convert matched events into FilteredEvent objects
        List<FilteredEvent> filteredEvents = matchedEvents.stream()
                .map(e -> new FilteredEvent(e.getRawData()))
                .collect(Collectors.toList());

        // Save the filtered events to the filtered_events collection
        filteredEventRepository.saveAll(filteredEvents);
        return ResponseEntity.ok("Filtered " + matchedEvents.size() + " events stored in 'filtered_events' collection.");
    }

    /**
     * Checks if the given rawData matches the filter criteria.
     * The rawData map contains keys like "source" and "event". If the filter field
     * is not found at the top level, we attempt to parse the JSON stored under "event".
     */
    private boolean matchesFilter(Map<String, Object> rawData, Map<String, Object> criteria) {
        if (criteria == null || criteria.isEmpty()) {
            return true; // If no criteria provided, match everything.
        }
        // Try to get the "event" field as a JSON string.
        String eventStr = rawData.get("event") != null ? rawData.get("event").toString() : null;
        Map<String, Object> eventData = null;
        if (eventStr != null) {
            try {
                // Parse the event JSON string into a Map.
                eventData = mapper.readValue(eventStr, Map.class);
            } catch (Exception e) {
                logger.error("Error parsing event JSON: {}", e.getMessage());
            }
        }
        // For each filter criterion, check for a matching value.
        for (Map.Entry<String, Object> entry : criteria.entrySet()) {
            String field = entry.getKey();
            Object expectedValue = entry.getValue();
            // First try the rawData map directly.
            Object actualValue = rawData.get(field);
            // If not found, try the parsed event data.
            if (actualValue == null && eventData != null) {
                actualValue = eventData.get(field);
            }
            if (actualValue == null || !actualValue.equals(expectedValue)) {
                return false;
            }
        }
        return true;
    }
}
