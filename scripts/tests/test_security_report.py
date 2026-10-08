import unittest
from scripts.security_report import compare, normalize


class SecurityReportTests(unittest.TestCase):
    def test_first_scan_does_not_invent_fixes(self):
        self.assertEqual(compare({"complete": True, "scope": "a", "findings": []}, None)["resolved"], [])

    def test_failed_scan_cannot_resolve_previous_findings(self):
        result = compare({"complete": False}, {"complete": True, "findings": [{"id": "x"}]})
        self.assertEqual(result["comparison"], "scan_incomplete")

    def test_scope_change_cannot_claim_fixes(self):
        self.assertEqual(compare({"complete": True, "scope": "new", "findings": []},
                                 {"complete": True, "scope": "old", "findings": [{"id": "x"}]})["resolved"], [])

    def test_compatible_scan_detects_new_and_removed(self):
        result = compare({"complete": True, "scope": "a", "findings": [{"id": "new"}]},
                         {"complete": True, "scope": "a", "findings": [{"id": "old"}]})
        self.assertEqual(result["resolved"], [{"id": "old"}])
        self.assertEqual(result["new"], [{"id": "new"}])

    def test_reviewed_hotspots_are_not_reported_as_pending(self):
        self.assertEqual(normalize("sonarqube", {"hotspots": [{"key": "x", "status": "REVIEWED"}]}), [])
