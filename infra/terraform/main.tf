variable "project_name" {
  type    = string
  default = "cloudscope"
  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{2,30}$", var.project_name))
    error_message = "Use 3 to 31 lowercase letters, digits or hyphens."
  }
}

variable "postgres_volume" {
  description = "Exact existing PostgreSQL volume name, verified on the VPS."
  type        = string
  validation {
    condition     = can(regex("^[a-zA-Z0-9][a-zA-Z0-9_.-]+$", var.postgres_volume))
    error_message = "A valid Docker volume name is required."
  }
}

resource "docker_network" "application" {
  name   = "${var.project_name}-managed"
  driver = "bridge"
  labels {
    label = "managed-by"
    value = "terraform"
  }
}

# Import before the first apply. prevent_destroy protects application data.
resource "docker_volume" "postgres" {
  name = var.postgres_volume
  lifecycle {
    prevent_destroy = true
  }
}

resource "docker_volume" "caddy_data" {
  name = "${var.project_name}-managed-caddy-data"
  lifecycle {
    prevent_destroy = true
  }
}

resource "docker_volume" "caddy_config" {
  name = "${var.project_name}-managed-caddy-config"
  lifecycle {
    prevent_destroy = true
  }
}

output "network_name" {
  value = docker_network.application.name
}
output "postgres_volume" {
  value = docker_volume.postgres.name
}
output "caddy_data_volume" {
  value = docker_volume.caddy_data.name
}
output "caddy_config_volume" {
  value = docker_volume.caddy_config.name
}
