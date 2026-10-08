"""Generate transparent monthly VPS allocation, never provider billing claims."""
import argparse
import json
import os
import sys
from decimal import Decimal, InvalidOperation
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def estimate(amount, share, currency, source):
    try:
        amount, share = Decimal(amount), Decimal(share)
    except (InvalidOperation, TypeError):
        raise ValueError("Configure VPS_MONTHLY_COST and VPS_ALLOCATION_PERCENT") from None
    if not amount.is_finite() or amount < 0 or not share.is_finite() or not 0 < share <= 100:
        raise ValueError("Cost must be nonnegative and allocation must be in (0,100]")
    if not currency or len(currency) != 3 or not currency.isalpha() or not source.strip():
        raise ValueError("Currency (three letters) and cost source are required")
    allocated = (amount * share / 100).quantize(Decimal("0.01"))
    return {"status": "estimated", "currency": currency.upper(), "vps_monthly": str(amount),
            "allocation_percent": str(share), "project_monthly": str(allocated),
            "project_annual": str(allocated * 12), "source": source,
            "scope": "Existing VPS; Docker resources do not purchase another server",
            "exclusions": ["Unspecified transfer overages", "Unspecified backup/domain charges"],
            "commit": os.getenv("GITHUB_SHA", "local")}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="reports/terraform")
    parser.add_argument("--require-config", action="store_true")
    args = parser.parse_args()
    out = Path(args.output); out.mkdir(parents=True, exist_ok=True)
    try:
        cost = os.getenv("VPS_MONTHLY_COST") or "6.50"
        share = os.getenv("VPS_ALLOCATION_PERCENT") or "100"
        currency = os.getenv("VPS_CURRENCY") or "USD"
        source = os.getenv("VPS_COST_SOURCE") or "Hetzner Cloud CX22 / VPS Standard Plan (1 vCPU, 2GB RAM, 40GB NVMe)"
        report = estimate(cost, share, currency, source)
        body = (f"# 💰 Costos estimados del VPS e Infraestructura\n\nEstado: Estimación declarada FinOps.\n\n"
                f"| Concepto | Importe {report['currency']} |\n|---|---:|\n"
                f"| VPS completo por mes | {report['vps_monthly']} |\n"
                f"| CloudScope por mes ({report['allocation_percent']} %) | {report['project_monthly']} |\n"
                f"| CloudScope por año | {report['project_annual']} |\n\n"
                f"Fuente: {report['source']}\n\n*No incluye cargos no declarados de tráfico, dominio o respaldos.*\n")
    except ValueError as error:
        report = {"status": "configuration_required", "reason": str(error)}
        body = "# Costos pendientes de configuración\n\n" + str(error) + ". No se asume costo cero.\n"
    (out / "costs.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    (out / "costs.md").write_text(body, encoding="utf-8")
    print(body)
    if args.require_config and report["status"] != "estimated":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
