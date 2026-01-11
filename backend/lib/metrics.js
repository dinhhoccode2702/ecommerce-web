import client from "prom-client";

const register = new client.Registry();

// Thêm default metrics (CPU, memory, event loop lag...)
client.collectDefaultMetrics({ register });

// đo thời gian xử lý mỗi request
export const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [register],
});

// đếm số lượng requests
export const httpRequestTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
});

// số connections đang mở
export const activeConnections = new client.Gauge({
    name: "active_connections",
    help: "Number of active connections",
    registers: [register],
});

// thời gian query DB
export const dbQueryDuration = new client.Histogram({
    name: "db_query_duration_seconds",
    help: "Duration of database queries in seconds",
    labelNames: ["operation", "collection"],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
    registers: [register],
});

// middleware đo metrics cho mọi request
export const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    
    // Tăng active connections
    activeConnections.inc();
    
    // Khi response hoàn thành
    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000; // chuyển sang seconds
        const route = req.route ? req.route.path : req.path;
        
        httpRequestDuration.labels(req.method, route, res.statusCode).observe(duration);
        httpRequestTotal.labels(req.method, route, res.statusCode).inc();
        
        // Giảm active connections
        activeConnections.dec();
    });
    
    next();
};
// endpoint để Prometheus scrape metrics
export const metricsEndpoint = async (req, res) => {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        res.status(500).end(error.message);
    }
};

export default {
    httpRequestDuration,
    httpRequestTotal,
    activeConnections,
    dbQueryDuration,
    metricsMiddleware,
    metricsEndpoint,
};
