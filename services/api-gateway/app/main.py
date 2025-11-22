from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app, Counter, Histogram
import logging
from pythonjsonlogger import jsonlogger

from .config import settings
from .routers import auth, events, alerts, rules, health

# Configure structured logging
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(settings.log_level.upper())

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="API Gateway for Smart Retail Alert & Monitoring Platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
REQUEST_COUNT = Counter(
    "api_gateway_requests_total",
    "Total requests",
    ["method", "endpoint", "status"]
)

REQUEST_DURATION = Histogram(
    "api_gateway_request_duration_seconds",
    "Request duration",
    ["method", "endpoint"]
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(
    auth.router,
    prefix=f"{settings.api_v1_prefix}/auth",
    tags=["Authentication"]
)
app.include_router(
    events.router,
    prefix=f"{settings.api_v1_prefix}/events",
    tags=["Events"]
)
app.include_router(
    alerts.router,
    prefix=f"{settings.api_v1_prefix}/alerts",
    tags=["Alerts"]
)
app.include_router(
    rules.router,
    prefix=f"{settings.api_v1_prefix}/rules",
    tags=["Rules"]
)

# Mount Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)


@app.on_event("startup")
async def startup_event():
    logger.info(
        "Starting API Gateway",
        extra={
            "environment": settings.environment,
            "service": settings.otel_service_name
        }
    )


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down API Gateway")


@app.get("/")
async def root():
    return {
        "service": "Smart Retail API Gateway",
        "version": "1.0.0",
        "status": "running"
    }
