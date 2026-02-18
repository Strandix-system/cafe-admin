import dayjs from "dayjs";

export const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const parseHoursFromBackend = (hoursString) => {
    if (!hoursString || typeof hoursString !== "string") {
        return { open: null, close: null };
    }

    const parts = hoursString.split(" - ");
    if (parts.length !== 2) {
        return { open: null, close: null };
    }

    const openTime = dayjs(parts[0].trim(), "h:mm a");
    const closeTime = dayjs(parts[1].trim(), "h:mm a");

    return {
        open: openTime.isValid() ? openTime.toISOString() : null,
        close: closeTime.isValid() ? closeTime.toISOString() : null,
    };
};

export const formatHoursForBackend = (hours) => {
    if (!hours) return { weekdays: "", weekends: "" };

    const formatTimeRange = (open, close) => {
        if (!open || !close) return "";
        const openStr = dayjs(open).format("h:mm a");
        const closeStr = dayjs(close).format("h:mm a");
        return `${openStr} - ${closeStr}`;
    };

    return {
        weekdays: formatTimeRange(hours.weekdays?.open, hours.weekdays?.close),
        weekends: formatTimeRange(hours.weekends?.open, hours.weekends?.close),
    };
};