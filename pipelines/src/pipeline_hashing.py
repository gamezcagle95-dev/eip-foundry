import hashlib
import json
import os
import sys
from datetime import datetime, UTC

def generate_proof_packet(data_path):
    """
    Simulates the LexTrinity forensic gate by validating data
    and generating a cryptographic Proof Packet.
    """
    print(f"--- LexTrinity Forensic Evaluation Started: {datetime.now(UTC)} ---")

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data at {data_path} not found.")

    # 1. Forensic Hashing (SHA-256)
    sha256_hash = hashlib.sha256()
    with open(data_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)

    data_hash = sha256_hash.hexdigest()
    print(f"Asset Hash: {data_hash}")

    # 2. Metadata Generation (Simulated Data/Weight Provenance)
    proof_packet = {
        "version": "1.0.0",
        "timestamp": datetime.now(UTC).isoformat(),
        "asset_hash": data_hash,
        "forensic_status": "VALIDATED",
        "evaluator": "LexTrinity-Alpha",
        "forensic_report": {
            "integrity_check": "passed",
            "malware_scan": "clean",
            "provenance_verified": True
        }
    }

    # 3. Final Proof Packet Hash (The 'Gate' Output)
    packet_json = json.dumps(proof_packet, sort_keys=True)
    packet_hash = hashlib.sha256(packet_json.encode()).hexdigest()

    print(f"Proof Packet Generated: {packet_hash}")
    print(f"--- Evaluation Complete ---")

    return packet_hash, proof_packet

if __name__ == "__main__":
    # Use path from command line if provided, else use dummy_weights.bin
    target_path = sys.argv[1] if len(sys.argv) > 1 else "dummy_weights.bin"
    is_dummy = len(sys.argv) <= 1

    if is_dummy:
        with open(target_path, "wb") as f:
            f.write(os.urandom(1024))

    try:
        packet_hash, packet = generate_proof_packet(target_path)

        # Standardized Export for Phase 2 integration
        export_data = {
            "packet_hash": packet_hash,
            "packet": packet
        }

        # Ensure a 'proofs' directory exists
        os.makedirs("proofs", exist_ok=True)

        export_filename = f"proofs/proof_packet_{packet_hash[:16]}.json"
        with open(export_filename, "w") as f:
            json.dump(export_data, f, indent=4)

        print(f"Forensic Proof Packet exported to: {export_filename}")

    finally:
        if is_dummy and os.path.exists(target_path):
            os.remove(target_path)
