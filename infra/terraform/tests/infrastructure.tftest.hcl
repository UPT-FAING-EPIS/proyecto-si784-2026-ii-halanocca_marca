mock_provider "docker" {}

variables {
  postgres_volume = "cloudscope_cloudscope_pgdata"
}

run "isolated_network" {
  command = plan
  assert {
    condition     = docker_network.application.name == "cloudscope-managed" && docker_network.application.driver == "bridge"
    error_message = "Application must have a dedicated bridge network."
  }
}

run "preserve_database_volume" {
  command = plan
  assert {
    condition     = docker_volume.postgres.name == "cloudscope_cloudscope_pgdata"
    error_message = "Never silently replace the database with a new volume."
  }
  assert {
    condition     = docker_volume.caddy_data.name != docker_volume.postgres.name
    error_message = "Certificates and PostgreSQL must use different volumes."
  }
}

run "reject_invalid_project" {
  command = plan
  variables {
    project_name = "INVALID project"
  }
  expect_failures = [var.project_name]
}

run "reject_empty_database_volume" {
  command = plan
  variables {
    postgres_volume = ""
  }
  expect_failures = [var.postgres_volume]
}
