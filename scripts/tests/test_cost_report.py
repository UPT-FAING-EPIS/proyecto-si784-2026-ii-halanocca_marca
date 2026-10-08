import unittest
from scripts.cost_report import estimate


class CostTests(unittest.TestCase):
    def test_shared_vps_allocation(self):
        result = estimate("40", "25", "usd", "Invoice reference")
        self.assertEqual(result["project_monthly"], "10.00")
        self.assertEqual(result["project_annual"], "120.00")

    def test_missing_and_invalid_inputs_are_not_zero_cost(self):
        for amount, share, currency, source in [("", "100", "USD", "x"), ("NaN", "100", "USD", "x"),
                ("-1", "100", "USD", "x"), ("10", "101", "USD", "x"), ("10", "100", "", "x"),
                ("10", "100", "USD", "")]:
            with self.assertRaises(ValueError):
                estimate(amount, share, currency, source)
