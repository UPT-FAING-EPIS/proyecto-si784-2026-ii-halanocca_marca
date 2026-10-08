"""Normalize real scanner findings and compare compatible historical snapshots."""
import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')


def fingerprint(*parts):
    return hashlib.sha256(json.dumps(parts, sort_keys=True).encode()).hexdigest()[:24]


def normalize(tool, data):
    findings = []
    if tool == "semgrep":
        for item in data.get("results", []):
            extra = item.get("extra", {})
            findings.append({"id": fingerprint(item["check_id"], item["path"], extra.get("lines", "")),
                             "rule": item["check_id"], "path": item["path"],
                             "line": item.get("start", {}).get("line"), "severity": extra.get("severity"),
                             "message": extra.get("message", "")})
    elif tool == "snyk":
        for project in data:
            for item in project.get("vulnerabilities", []):
                findings.append({"id": fingerprint(project.get("targetFile"), item["id"], item.get("from", [])),
                                 "rule": item["id"], "path": project.get("targetFile", ""),
                                 "severity": item.get("severity"), "message": item.get("title", "")})
    elif tool == "sonarqube":
        for item in data.get("issues", []):
            findings.append({"id": item["key"], "rule": item.get("type", item.get("rule")),
                             "path": item.get("component"), "severity": item.get("severity"),
                             "message": item.get("message", "")})
        for item in data.get("hotspots", []):
            if item.get("status") != "REVIEWED":
                findings.append({"id": item["key"], "rule": "SECURITY_HOTSPOT", "path": item.get("component"),
                                 "severity": item.get("vulnerabilityProbability"), "message": item.get("message", "")})
    return sorted({f["id"]: f for f in findings}.values(), key=lambda f: f["id"])


def compare(current, previous):
    if not current["complete"]:
        return {"comparison": "scan_incomplete", "new": [], "resolved": []}
    if not previous or not previous.get("complete") or previous.get("scope") != current.get("scope"):
        return {"comparison": "no_compatible_baseline", "new": [], "resolved": []}
    before = {f["id"]: f for f in previous["findings"]}
    now = {f["id"]: f for f in current["findings"]}
    return {"comparison": "compared", "new": [now[k] for k in now.keys() - before.keys()],
            "resolved": [before[k] for k in before.keys() - now.keys()]}


def write_report(tool, data, complete, scope, error="", output=None):
    out = Path(output or f"reports/{tool}"); out.mkdir(parents=True, exist_ok=True)
    snapshot = {"tool": tool, "complete": complete, "scope": scope, "commit": os.getenv("GITHUB_SHA", "local"),
                "findings": normalize(tool, data), "error": error}
    previous = None
    baseline = Path(f"baseline/{tool}/snapshot.json")
    if baseline.exists():
        previous = json.loads(baseline.read_text(encoding="utf-8"))
    diff = compare(snapshot, previous)
    (out / "snapshot.json").write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    (out / "comparison.json").write_text(json.dumps(diff, indent=2), encoding="utf-8")
    rows = [f"# Reporte {tool}", "", f"Commit: `{snapshot['commit']}`", "",
            f"Análisis completo: **{'sí' if complete else 'no'}**", f"Hallazgos abiertos: **{len(snapshot['findings'])}**", ""]
    if error: rows += [f"Error: {error}", ""]
    if diff["comparison"] == "compared":
        rows += [f"Nuevos: {len(diff['new'])}. Ausentes respecto del análisis anterior: {len(diff['resolved'])}.",
                 "La ausencia indica una corrección candidata; revisar el cambio antes de atribuir una remediación.", ""]
    else:
        rows += ["Correcciones superadas: **no verificables** sin dos análisis completos de alcance compatible.", ""]
    for title, values in [("Hallazgos abiertos", snapshot["findings"]), ("Hallazgos ausentes frente a la línea base", diff["resolved"])]:
        rows += [f"## {title}", "", "| Regla | Archivo | Severidad | Descripción |", "|---|---|---|---|"]
        for finding in values:
            fields = [str(finding.get(k, "")).replace("|", "\\|").replace("\n", " ") for k in ["rule", "path", "severity", "message"]]
            rows.append("| " + " | ".join(fields) + " |")
        rows.append("")
    text = "\n".join(rows)
    (out / "report.md").write_text(text, encoding="utf-8")
    if os.getenv("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as stream: stream.write(text)
    return complete and not snapshot["findings"]


def baseline(tool):
    # Only same-branch runs, and never execute code from downloaded artifacts.
    workflow = os.environ.get("GITHUB_WORKFLOW_REF", "").split("@", 1)[0].split("/")[-1]
    ref = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME", "main")
    proc = subprocess.run(["gh", "run", "list", "--workflow", workflow, "--branch", ref, "--status", "completed",
                           "--limit", "10", "--json", "databaseId"], capture_output=True, text=True)
    if proc.returncode: return
    for run in json.loads(proc.stdout):
        if str(run["databaseId"]) == os.getenv("GITHUB_RUN_ID"): continue
        result = subprocess.run(["gh", "run", "download", str(run["databaseId"]), "--name", f"security-{tool}",
                                 "--dir", f"baseline/{tool}"], capture_output=True)
        if result.returncode == 0: return


if __name__ == "__main__":
    parser = argparse.ArgumentParser(); parser.add_argument("tool", choices=["semgrep", "snyk", "sonarqube"])
    parser.add_argument("--baseline", action="store_true"); args = parser.parse_args()
    if args.baseline: baseline(args.tool)
