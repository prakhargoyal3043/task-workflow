package com.prakhar.taskworkflow.dto;

import java.util.Map;

public class DashboardResponse {

    private Map<?, Long> summary;
    private Map<?, Long> taskByUser;

    public DashboardResponse(Map<?, Long> summary,
                             Map<?, Long> taskByUser) {
        this.summary = summary;
        this.taskByUser = taskByUser;
    }

    public Map<?, Long> getSummary() {
        return summary;
    }

    public Map<?, Long> getTaskByUser() {
        return taskByUser;
    }
}
