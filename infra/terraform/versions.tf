terraform {
  required_version = ">= 1.7.0, < 2.0.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.6"
    }
  }
}

# Runs on the existing VPS. State stays on that host, never in a public artifact.
provider "docker" {
  host = "unix:///var/run/docker.sock"
}
