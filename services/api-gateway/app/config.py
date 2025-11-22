from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App Configuration
    app_name: str = "Smart Retail API Gateway"
    environment: str = "development"
    debug: bool = True
    log_level: str = "info"
    
    # API Configuration
    api_gateway_port: int = 8000
    api_v1_prefix: str = "/api/v1"
    
    # JWT Configuration
    jwt_secret_key: str = "change-this-secret-key-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60
    jwt_refresh_expiration_days: int = 7
    
    # CORS
    cors_origins: str = "http://localhost:3000,https://smart-retail-frontend.onrender.com"
    
    # Service URLs
    event_ingestion_url: str = "http://localhost:8001"
    alert_rules_engine_url: str = "http://localhost:8002"
    query_analytics_url: str = "http://localhost:8003"
    user_management_url: str = "http://localhost:8004"
    
    # OpenTelemetry
    jaeger_agent_host: str = "localhost"
    jaeger_agent_port: int = 6831
    otel_service_name: str = "api-gateway"
    
    # Rate Limiting
    rate_limit_per_minute: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
