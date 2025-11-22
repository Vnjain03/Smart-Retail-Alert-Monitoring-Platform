# Deployment Guide

## Overview

This document provides comprehensive deployment instructions for the Smart Retail Alert & Monitoring Platform.

## Local Development

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd SMART-RETAIL-ALERT-MONITORING-PLATFORM

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access Points
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs
- Kafka UI: http://localhost:8080
- Grafana: http://localhost:3001 (admin/admin)
- Jaeger UI: http://localhost:16686

## Cloud Deployment Options

### Option 1: Render.com (Free Tier - Recommended for Demo)

#### Automatic Deployment (Using render.yaml)

1. **Sign up** at https://render.com
2. **Connect your GitHub repository**
3. **Click "New" -> "Blueprint"**
4. **Select your repository** - Render will detect the `render.yaml` file
5. **Review the services** that will be created
6. **Click "Apply"** to create all services

#### Manual Frontend Deployment

If deploying the frontend manually as a Static Site:

1. **Create a new Static Site** on Render
2. **Configure build settings**:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
3. **Add Rewrite Rule** (if not using render.yaml):
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

The `_redirects` file in `frontend/public/` will automatically handle SPA routing.

#### Backend Services

For each backend service:
1. **Create a new Web Service**
2. **Select Docker** as environment
3. **Set Dockerfile path** (e.g., `./services/api-gateway/Dockerfile`)
4. **Configure environment variables** as needed

**Estimated Cost**: Free tier available

### Option 2: Railway.app (Simple Deployment)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy services
railway up
```

**Estimated Cost**: $5/month free credit

### Option 3: Fly.io (Global Edge Deployment)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy each service
cd services/api-gateway
fly launch

cd ../event-ingestion
fly launch

# Repeat for all services
```

**Estimated Cost**: Free tier for 3 VMs

### Option 4: Azure (Full Production)

#### Prerequisites
- Azure CLI installed
- Azure subscription

#### Steps

```bash
# Login to Azure
az login

# Create resource group
az group create --name smart-retail-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group smart-retail-rg \
  --name smart-retail-cluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group smart-retail-rg \
  --name smart-retail-cluster

# Create Cosmos DB
az cosmosdb create \
  --name smart-retail-cosmos \
  --resource-group smart-retail-rg \
  --kind GlobalDocumentDB

# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

**Estimated Cost**: $200-300/month

### Option 5: AWS EKS

```bash
# Create EKS cluster
eksctl create cluster \
  --name smart-retail-cluster \
  --region us-west-2 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3

# Deploy
kubectl apply -f infrastructure/kubernetes/
```

**Estimated Cost**: $180-250/month

### Option 6: Google Cloud (GKE)

```bash
# Create GKE cluster
gcloud container clusters create smart-retail-cluster \
  --num-nodes=3 \
  --zone=us-central1-a

# Get credentials
gcloud container clusters get-credentials smart-retail-cluster

# Deploy
kubectl apply -f infrastructure/kubernetes/
```

## Database Setup

### For Local Development (Docker Compose)
Uses in-memory storage or local MongoDB.

### For Production

#### Azure Cosmos DB
1. Create Cosmos DB account
2. Create database: `smart_retail`
3. Create containers:
   - `events` (partition key: `/service`)
   - `alerts` (partition key: `/service`)
   - `rules` (partition key: `/service`)
   - `users` (partition key: `/id`)

#### Alternative: MongoDB Atlas (Free Tier Available)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Whitelist IP addresses
4. Get connection string
5. Update environment variables

## CI/CD Setup

### GitHub Actions

1. Add secrets to your GitHub repository:
   - `CONTAINER_REGISTRY`: Your container registry URL
   - `REGISTRY_USERNAME`: Registry username
   - `REGISTRY_PASSWORD`: Registry password
   - `KUBECONFIG`: Kubernetes config (if deploying to K8s)

2. Push to main branch triggers:
   - Linting and tests
   - Docker image builds
   - Deployment to production

## Monitoring Setup

### Prometheus + Grafana

Already included in `docker-compose.yml`:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### For Kubernetes

```bash
# Install Prometheus using Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

## Security Checklist

- [ ] Change JWT secret key in production
- [ ] Set up TLS/SSL certificates
- [ ] Configure network policies in Kubernetes
- [ ] Set up Azure Key Vault or AWS Secrets Manager
- [ ] Enable firewall rules
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable audit logging

## Troubleshooting

### Services not starting
```bash
docker-compose logs <service-name>
```

### Kafka connection issues
```bash
docker-compose restart kafka
```

### Database connection issues
- Check connection strings
- Verify network connectivity
- Check firewall rules

## Performance Optimization

### Horizontal Scaling
```bash
# Scale specific service
kubectl scale deployment api-gateway --replicas=5 -n smart-retail
```

### Database Indexing
Create indexes on frequently queried fields:
- `events`: `timestamp`, `service`, `status`
- `alerts`: `timestamp`, `service`, `severity`, `acknowledged`

## Backup and Recovery

### Database Backups
- Azure Cosmos DB: Automatic backups enabled
- MongoDB Atlas: Automatic snapshots

### Application State
- Export Kafka topics using Kafka Connect
- Backup Grafana dashboards via API

## Cost Optimization

### For Demo/Resume
- Use Render.com free tier
- Use MongoDB Atlas free M0 cluster
- Deploy minimal replicas (1-2 per service)

### For Production
- Use reserved instances
- Enable auto-scaling with proper limits
- Use spot instances for non-critical workloads
- Monitor costs with cloud cost management tools

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Email: your-email@example.com
