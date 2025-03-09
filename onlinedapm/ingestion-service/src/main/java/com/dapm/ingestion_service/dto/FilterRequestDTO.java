package com.dapm.ingestion_service.dto;

import java.util.Map;

public class FilterRequestDTO {
    private Map<String, Object> filterCriteria;

    public FilterRequestDTO() {
    }

    public Map<String, Object> getFilterCriteria() {
        return filterCriteria;
    }

    public void setFilterCriteria(Map<String, Object> filterCriteria) {
        this.filterCriteria = filterCriteria;
    }
}
