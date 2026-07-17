import unittest
from unittest.mock import MagicMock, patch
from pipelines.src.tee_inference import get_payment_collector, run_tee_inference

class TestTeeInference(unittest.TestCase):
    def test_get_payment_collector_no_address(self):
        # If no contract address is provided, it should return None
        result = get_payment_collector(None, 0)
        self.assertIsNone(result)

    @patch("pipelines.src.tee_inference.Web3")
    def test_get_payment_collector_connection_failure(self, mock_web3):
        # If Web3 cannot connect, it should return None
        mock_instance = mock_web3.return_value
        mock_instance.is_connected.return_value = False

        result = get_payment_collector("0x1234567890123456789012345678901234567890", 0)
        self.assertIsNone(result)

    @patch("pipelines.src.tee_inference.Web3")
    def test_get_payment_collector_success(self, mock_web3):
        mock_instance = mock_web3.return_value
        mock_instance.is_connected.return_value = True

        # Mock checksum address and contract
        mock_instance.to_checksum_address.side_effect = lambda x: x

        mock_contract = MagicMock()
        mock_instance.eth.contract.return_value = mock_contract

        mock_collector_address = "0x9999999999999999999999999999999999999999"
        mock_contract.functions.paymentCollectors.return_value.call.return_value = mock_collector_address

        result = get_payment_collector("0x1234567890123456789012345678901234567890", 5)
        self.assertEqual(result, mock_collector_address)
        mock_contract.functions.paymentCollectors.assert_called_with(5)

    @patch("pipelines.src.tee_inference.Web3")
    def test_run_tee_inference_fallback(self, mock_web3):
        # If Web3 query fails, it should fallback to 0x0...0
        mock_instance = mock_web3.return_value
        mock_instance.is_connected.return_value = False

        event = run_tee_inference("dummy_path", {"data": 123}, token_id=2, contract_address="0x1234567890123456789012345678901234567890")

        self.assertEqual(event["token_id"], 2)
        self.assertEqual(event["payment_collector"], "0x0000000000000000000000000000000000000000")
        self.assertTrue(event["royalty_trigger"])

    @patch("pipelines.src.tee_inference.Web3")
    def test_run_tee_inference_success(self, mock_web3):
        mock_instance = mock_web3.return_value
        mock_instance.is_connected.return_value = True
        mock_instance.to_checksum_address.side_effect = lambda x: x

        mock_contract = MagicMock()
        mock_instance.eth.contract.return_value = mock_contract

        mock_collector_address = "0x7777777777777777777777777777777777777777"
        mock_contract.functions.paymentCollectors.return_value.call.return_value = mock_collector_address

        event = run_tee_inference("dummy_path", {"data": 123}, token_id=7, contract_address="0x1234567890123456789012345678901234567890")

        self.assertEqual(event["token_id"], 7)
        self.assertEqual(event["payment_collector"], mock_collector_address)
        self.assertTrue(event["royalty_trigger"])

if __name__ == "__main__":
    unittest.main()
