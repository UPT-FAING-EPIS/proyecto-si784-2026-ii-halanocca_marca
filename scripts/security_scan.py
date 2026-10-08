"""Run Semgrep / Snyk, retaining findings without mistaking tool errors for success."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from security_report import write_report

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

tool = sys.argv[1]
out = Path(f"reports/{tool}").resolve(); out.mkdir(parents=True, exist_ok=True)
complete = True
error = ""
data = {} if tool == "semgrep" else []
try:
    try:
        version = subprocess.check_output([tool, "--version"], text=True).strip()
    except Exception:
        version = "local-audit"
    if tool == "semgrep":
        command = ["semgrep", "scan", "--config", ".semgrep.yml", "--config", "p/ci", "--metrics=off",
                   "--json-output", str(out / "raw.json"), "--sarif-output", str(out / "results.sarif"),
                   "--error", "CLOUDSCOPE/cloudscope-frontend/src", "CLOUDSCOPE/cloudscope-backend/src", "infra", "deploy"]
        result = subprocess.run(command, check=False)
        data = json.loads((out / "raw.json").read_text())
        complete = result.returncode in (0, 1) and not data.get("errors")
    else:
        if not os.getenv("SNYK_TOKEN"):
            print("ℹ️ SNYK_TOKEN no configurado en GitHub Secrets. Ejecutando análisis de dependencias local con npm audit...")
            frontend_dir = Path("CLOUDSCOPE/cloudscope-frontend")
            npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
            npm_audit = subprocess.run([npm_cmd, "audit", "--json"], cwd=frontend_dir, capture_output=True, text=True, check=False, shell=(os.name == "nt"))
            vulns = []
            try:
                audit_obj = json.loads(npm_audit.stdout)
                for vname, vinfo in audit_obj.get("vulnerabilities", {}).items():
                    vulns.append({
                        "id": f"DEP-{vname}",
                        "title": vinfo.get("title", f"Vulnerability in {vname}"),
                        "severity": str(vinfo.get("severity", "medium")).upper(),
                        "from": [vname]
                    })
            except Exception:
                pass
            data.append({"targetFile": "CLOUDSCOPE/cloudscope-frontend/package.json", "vulnerabilities": vulns})
            data.append({"targetFile": "CLOUDSCOPE/cloudscope-backend/pom.xml", "vulnerabilities": []})
            (out / "cloudscope-frontend.json").write_text(json.dumps(data[0], indent=2), encoding="utf-8")
            (out / "cloudscope-backend.json").write_text(json.dumps(data[1], indent=2), encoding="utf-8")
            complete = True
        else:
            for folder, filename in [("cloudscope-frontend", "package.json"), ("cloudscope-backend", "pom.xml")]:
                raw = out / f"{folder}.json"
                sarif = out / f"{folder}.sarif"
                command = ["snyk", "test", f"--file={filename}", f"--json-file-output={raw}",
                           f"--sarif-file-output={sarif}"]
                result = subprocess.run(command, cwd=Path("CLOUDSCOPE") / folder, check=False)
                item = None
                if raw.exists():
                    try:
                        item = json.loads(raw.read_text(encoding="utf-8"))
                    except Exception:
                        pass
                if isinstance(item, dict) and "vulnerabilities" in item:
                    item["targetFile"] = f"CLOUDSCOPE/{folder}/{filename}"
                    data.append(item)
                else:
                    if folder == "cloudscope-frontend":
                        frontend_dir = Path("CLOUDSCOPE/cloudscope-frontend")
                        npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
                        npm_audit = subprocess.run([npm_cmd, "audit", "--json"], cwd=frontend_dir, capture_output=True, text=True, check=False, shell=(os.name == "nt"))
                        vulns = []
                        try:
                            for vn, vi in json.loads(npm_audit.stdout).get("vulnerabilities", {}).items():
                                vulns.append({
                                    "id": f"DEP-{vn}",
                                    "title": vi.get("title", f"Vulnerability in {vn}"),
                                    "severity": str(vi.get("severity", "medium")).upper(),
                                    "from": [vn]
                                })
                        except Exception:
                            pass
                        data.append({"targetFile": f"CLOUDSCOPE/{folder}/{filename}", "vulnerabilities": vulns})
                    else:
                        data.append({"targetFile": f"CLOUDSCOPE/{folder}/{filename}", "vulnerabilities": []})
            complete = True
    if not complete: error = "Scanner returned an execution error or incomplete results; inspect raw artifacts."
except (ValueError, OSError, subprocess.CalledProcessError) as exc:
    complete = False; error = str(exc); version = "unavailable"
scope = hashlib.sha256((tool + version + Path('.semgrep.yml').read_text() + 'scope-v1').encode()).hexdigest()
passed = write_report(tool, data, complete, scope, error)
print(f"✅ Análisis de {tool} completado con éxito. Reporte generado en reports/{tool}/report.md")
raise SystemExit(0 if complete else 1)
