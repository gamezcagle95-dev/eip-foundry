# Wurkspace: Economic Infrastructure for Intelligence

Wurkspace is a monorepo designed to transform AI training data, model weights, and infrastructure into liquid financial assets using smart contracts. It embeds programmatic royalties into model execution layers through a forensic evaluation gate known as **LexTrinity**.

## Core Components

- **`contracts/`**: Ethereum L2 (Base/Arbitrum/Optimism) settlement layer using Hardhat.
- **`pipelines/`**: AI data processing and TEE (Trusted Execution Environment) inference engine.
- **`infra/`**: Dockerized environment for consistent development and deployment.
- **`.github/workflows/`**: Automated Proof Packet generation and forensic auditing.

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

We utilize a strict branching strategy to ensure forensic soundness:
- **`main`**: Production-ready code. Each commit is a "Proof Packet" candidate.
- **`develop`**: Integration branch for new features.
- **`feature/*`**: Individual feature development.
- **`release/*`**: Preparation for new production releases.

## LexTrinity Forensic Gate

The `pipelines/src/pipeline_hashing.py` script acts as the forensic gate, validating data integrity and generating cryptographic Proof Packets before on-chain tokenization.
