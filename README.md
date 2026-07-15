# Wurkspace: Economic Infrastructure for Intelligence

Wurkspace is a monorepo designed to transform AI training data, model weights, and infrastructure into liquid financial assets using smart contracts. It embeds programmatic royalties and revenue routing into model execution layers through an asset validation gate.

## Core Components

- **`contracts/`**: Ethereum L2 (Base/Arbitrum/Optimism) settlement layer using Hardhat. Manages model weight assets (`DataWeightToken.sol`) and enables designated revenue collectors (`setPaymentCollector`).
- **`pipelines/`**: AI data processing and TEE (Trusted Execution Environment) inference engine.
- **`infra/`**: Dockerized environment for consistent development and deployment.
- **`.github/workflows/`**: Automated Proof Packet generation and asset integrity validation.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Python (v3.11+)

### Environment Setup
Use the provided Docker environment for a unified workspace:
```bash
cd infra
docker-compose up -d
docker-compose exec wurkspace bash
```

### Smart Contracts
```bash
cd contracts
npm install
npx hardhat compile
```

### AI Pipelines
```bash
cd pipelines
pip install -r requirements.txt
python src/pipeline_hashing.py
```

## Branching Strategy (GitFlow)

We utilize a strict branching strategy to ensure code quality and consistency:
- **`main`**: Production-ready code. Each commit is a "Proof Packet" candidate.
- **`develop`**: Integration branch for new features.
- **`feature/*`**: Individual feature development.
- **`release/*`**: Preparation for new production releases.

## Asset Validation & Revenue Gate

The `pipelines/src/pipeline_hashing.py` script acts as the validation gate, validating data integrity and generating cryptographic Proof Packets before on-chain tokenization. It retrieves the designated payment collector from the smart contract registry to route revenue streams appropriately.
