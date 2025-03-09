package com.dapm.ingestion_service.dto;

import java.util.Map;

public class FilterIngestionRequestDTO {
    private String url;
    private Map<String, Object> filterCriteria;

    public FilterIngestionRequestDTO() {
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Map<String, Object> getFilterCriteria() {
        return filterCriteria;
    }

    public void setFilterCriteria(Map<String, Object> filterCriteria) {
        this.filterCriteria = filterCriteria;
    }
}
