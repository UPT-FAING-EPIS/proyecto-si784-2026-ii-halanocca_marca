#!/usr/bin/env bash
set -e

cd ~/cloudscope

# Pull latest images
docker pull "$BACKEND_IMAGE"
docker pull "$FRONTEND_IMAGE"

# Export Terraform-managed resource names
export TF_NETWORK=$(terraform -chdir=~/cloudscope/infra/terraform output -raw network_name)
export TF_POSTGRES_VOLUME=$(terraform -chdir=~/cloudscope/infra/terraform output -raw postgres_volume)
export TF_CADDY_DATA=$(terraform -chdir=~/cloudscope/infra/terraform output -raw caddy_data_volume)
export TF_CADDY_CONFIG=$(terraform -chdir=~/cloudscope/infra/terraform output -raw caddy_config_volume)

# Zero-downtime rolling update
BACKEND_IMAGE="$BACKEND_IMAGE" FRONTEND_IMAGE="$FRONTEND_IMAGE" \
  docker compose -f deploy/compose.release.yml pull
BACKEND_IMAGE="$BACKEND_IMAGE" FRONTEND_IMAGE="$FRONTEND_IMAGE" \
  docker compose -f deploy/compose.release.yml up -d --remove-orphans

# Health check
sleep 10
docker compose -f deploy/compose.release.yml ps
echo "✅ CloudScope ${GITHUB_REF_NAME:-latest} deployed successfully"
