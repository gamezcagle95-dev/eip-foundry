# Wurkspace Agent Guidance

This file provides programmatic setup and workflow instructions for agents working within the `eip-foundry` monorepo.

## Project Structure

- `contracts/`: Smart contracts using Hardhat.
- `pipelines/`: Data validation and TEE inference pipelines in Python.
- `infra/`: Local orchestration and Docker compose configurations.

## Developer Workflows

### Smart Contract Verification
Always compile and test smart contracts after modifying Solidity or JS test files:
```bash
cd contracts
npm install --legacy-peer-deps
npx hardhat compile
npx hardhat test
```

### Python/TEE Pipeline Execution
Dependencies should be installed using CPU-only packages for faster runtimes where applicable:
```bash
pip install -r pipelines/requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
python3 -m unittest discover -s pipelines/src/ -p "test_*.py"
```

## Coding Conventions
- Prefer ESM format in Node.js configurations.
- Ensure all Python code utilizes `datetime.now(UTC)` from the standard `datetime` module (avoiding deprecated `utcnow`).
