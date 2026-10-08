"""Run Semgrep / Snyk, retaining findings without mistaking tool errors for success."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from security_report import write_report

tool = sys.argv[1]
out = Path(f"reports/{tool}").resolve(); out.mkdir(parents=True, exist_ok=True)
complete = True
error = ""
data = {} if tool == "semgrep" else []
try:
    version = subprocess.check_output([tool, "--version"], text=True).strip()
    if tool == "semgrep":
        command = ["semgrep", "scan", "--config", ".semgrep.yml", "--config", "p/ci", "--metrics=off",
                   "--json-output", str(out / "raw.json"), "--sarif-output", str(out / "results.sarif"),
                   "--error", "CLOUDSCOPE/cloudscope-frontend/src", "CLOUDSCOPE/cloudscope-backend/src", "infra", "deploy"]
        result = subprocess.run(command, check=False)
        data = json.loads((out / "raw.json").read_text())
        complete = result.returncode in (0, 1) and not data.get("errors")
    else:
        if not os.getenv("SNYK_TOKEN"): raise ValueError("Configure the SNYK_TOKEN secret")
        for folder, filename in [("cloudscope-frontend", "package.json"), ("cloudscope-backend", "pom.xml")]:
            raw = out / f"{folder}.json"
            command = ["snyk", "test", f"--file={filename}", f"--json-file-output={raw}",
                       f"--sarif-file-output={out / (folder + '.sarif')}"]
            result = subprocess.run(command, cwd=Path("CLOUDSCOPE") / folder, check=False)
            item = json.loads(raw.read_text())
            complete &= result.returncode in (0, 1) and isinstance(item, dict) and "vulnerabilities" in item
            if isinstance(item, dict):
                item["targetFile"] = f"CLOUDSCOPE/{folder}/{filename}"
                data.append(item)
    if not complete: error = "Scanner returned an execution error or incomplete results; inspect raw artifacts."
except (ValueError, OSError, subprocess.CalledProcessError) as exc:
    complete = False; error = str(exc); version = "unavailable"
scope = hashlib.sha256((tool + version + Path('.semgrep.yml').read_text() + 'scope-v1').encode()).hexdigest()
passed = write_report(tool, data, complete, scope, error)
raise SystemExit(0 if passed else 1)
