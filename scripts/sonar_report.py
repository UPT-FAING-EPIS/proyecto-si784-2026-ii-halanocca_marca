"""Export the completed analysis, its gate, issues and hotspot review evidence."""
import json
import os
from pathlib import Path
import time
import urllib.parse
import urllib.request
from security_report import write_report

out = Path("reports/sonarqube"); out.mkdir(parents=True, exist_ok=True)
host = os.getenv("SONAR_HOST_URL", "").rstrip("/")
project = os.getenv("SONAR_PROJECT_KEY", "")


def api(path, **params):
    request = urllib.request.Request(host + path + "?" + urllib.parse.urlencode(params),
                                     headers={"Authorization": "Bearer " + os.environ["SONAR_TOKEN"]})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def pages(path, key, **params):
    result = []; page = 1
    while True:
        response = api(path, p=page, ps=100, **params)
        result.extend(response[key])
        total = response.get("paging", {}).get("total", response.get("total"))
        if total is None: raise ValueError("Missing pagination metadata")
        if len(result) >= total: return result
        page += 1
        if page > 100: raise ValueError("Report exceeds API pagination limit")


data = {}; complete = False; error = ""; gate_ok = False
try:
    if not host.startswith("https://") or not project: raise ValueError("Configure HTTPS SONAR_HOST_URL and SONAR_PROJECT_KEY")
    task_file = Path(".scannerwork/report-task.txt")
    values = dict(line.split("=", 1) for line in task_file.read_text().splitlines() if "=" in line)
    for attempt in range(60):
        task = api("/api/ce/task", id=values["ceTaskId"])["task"]
        if task["status"] in ("SUCCESS", "FAILED", "CANCELED"): break
        time.sleep(5)
    if task["status"] != "SUCCESS": raise ValueError("The submitted analysis did not complete successfully")
    gate = api("/api/qualitygates/project_status", analysisId=task["analysisId"])
    selector = {}
    if os.getenv("SONAR_PR_KEY"): selector["pullRequest"] = os.environ["SONAR_PR_KEY"]
    elif os.getenv("SONAR_BRANCH"): selector["branch"] = os.environ["SONAR_BRANCH"]
    data = {"analysisId": task["analysisId"], "gate": gate,
            "issues": pages("/api/issues/search", "issues", componentKeys=project, resolved="false", **selector),
            "hotspots": pages("/api/hotspots/search", "hotspots", projectKey=project, **selector)}
    complete = True; gate_ok = gate["projectStatus"]["status"] == "OK"
    (out / "raw.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    reviewed = [h for h in data["hotspots"] if h.get("status") == "REVIEWED"]
    (out / "reviewed-hotspots.json").write_text(json.dumps(reviewed, indent=2), encoding="utf-8")
except Exception as exc:
    error = str(exc)
write_report("sonarqube", data, complete, f"{host}/{project}/v1/{os.getenv('SONAR_BRANCH', '')}", error)
with (out / "report.md").open("a", encoding="utf-8") as stream:
    stream.write(f"\nQuality Gate aprobado: {'sí' if gate_ok else 'no'}.\n")
raise SystemExit(0 if complete and gate_ok else 1)
