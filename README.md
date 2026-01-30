# Blockchain Chat

A chat application where every message is a blockchain transaction on Base Sepolia — a free test network for the Base blockchain where ETH has no real value. Messages are stored on a smart contract — no database, no backend storage.

## Quick Start

1. Install a browser wallet ([Rabby](https://rabby.io/) or [MetaMask](https://metamask.io/)) and [add Base Sepolia](https://revoke.cash/learn/wallets/add-network/base-sepolia) to it
2. Get free testnet ETH from the [Coinbase faucet](https://portal.cdp.coinbase.com/products/faucet?token=ETH)
3. Copy `.env.example` to `.env` and fill in the values (see the comments in the file for instructions):
   ```
   cp .env.example .env
   ```
4. Install [Bun](https://bun.sh) (JavaScript runtime and package manager):
   - **macOS / Linux**: `curl -fsSL https://bun.sh/install | bash`
   - **Windows**: `powershell -c "irm bun.sh/install.ps1 | iex"`
5. Install dependencies:
   ```
   bun install
   ```
6. Run: `bun dev`
7. Open http://localhost:3000

---

## How This Project Works (Blockchain Primer)

If you're new to blockchain development, here's what each piece does and why.

### What is a blockchain?

A blockchain is a shared ledger that nobody owns. Once data is written to it, it can't be altered. In this app, we use it to store chat messages — every message is permanent and verifiable by anyone.

### What is a smart contract?

A smart contract is a program that lives on the blockchain. Ours is the `ChatRoom` contract — it has a `sendMessage` function to store messages and a `getMessages` function to read them back. Think of it as a public API that anyone can call, but instead of a server running it, the blockchain network runs it.

### What is a transaction?

When a user sends a message, they're submitting a **transaction** to the blockchain. This costs a tiny amount of ETH (called **gas**) because the network needs to process and permanently record it. The flow is:

1. User types a message and clicks Send
2. Their wallet pops up asking them to confirm the transaction
3. The transaction is broadcast to the network
4. Validators include it in a block
5. The contract's `sendMessage` function runs, storing the message on-chain

### What is an ABI?

The **ABI** (Application Binary Interface) is a JSON description of a smart contract's functions. It tells our frontend how to encode function calls and decode return data. You can see ours in `src/contracts/chatRoom.ts`.

### What is a wallet?

A wallet manages your private keys and signs transactions on your behalf. When you "connect your wallet" to a dApp, you're giving it permission to request signatures — the wallet never shares your private key. RainbowKit provides the connection UI in this app.

### What is a testnet?

**Base Sepolia** is a test network where ETH has no real value. It behaves identically to mainnet but lets you develop without spending real money. You can get free testnet ETH from the [Coinbase faucet](https://portal.cdp.coinbase.com/products/faucet?token=ETH).

---

## Project Structure

```
blockchain-chat/
├── public/index.html               # HTML entry point
├── server/index.ts                  # Bun HTTP server (bundles React on the fly)
├── src/
│   ├── index.tsx                    # React mount + provider setup
│   ├── App.tsx                      # Layout: header with wallet button + chat
│   ├── components/
│   │   ├── Chat.tsx                 # Composes MessageList and SendMessage
│   │   ├── MessageList.tsx          # Reads messages from the blockchain
│   │   └── SendMessage.tsx          # Sends messages as transactions
│   ├── config/
│   │   └── wagmi.ts                 # Blockchain connection config
│   └── contracts/
│       └── chatRoom.ts              # Contract address + ABI
├── package.json
└── tsconfig.json
```

### Key files to read in order

1. **`src/contracts/chatRoom.ts`** — The contract ABI. This defines what the smart contract can do: `sendMessage` to write and `getMessages` to read.

2. **`src/config/wagmi.ts`** — Configures which blockchain network to connect to (Base Sepolia) and sets up the wallet connection via RainbowKit.

3. **`src/index.tsx`** — Wraps the app in three providers:
   - `WagmiProvider` — makes blockchain hooks available throughout the app
   - `QueryClientProvider` — handles async data fetching (React Query)
   - `RainbowKitProvider` — provides the wallet connection UI

4. **`src/components/SendMessage.tsx`** — The write side. Uses `useWriteContract` to call `sendMessage` on the contract, and `useWaitForTransactionReceipt` to track confirmation.

5. **`src/components/MessageList.tsx`** — The read side. Calls `getMessages` on the contract via `useReadContract` and polls every 4 seconds for new messages.

### Library roles

| Library | Purpose |
|---------|---------|
| **wagmi** | React hooks for reading/writing to the blockchain |
| **viem** | Low-level Ethereum client (used by wagmi under the hood) |
| **RainbowKit** | Drop-in wallet connection UI |
| **React Query** | Caches and manages async state from blockchain calls |

---

## Smart Contract

The Solidity contract stores messages in an array and exposes a view function to read them:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ChatRoom {
    struct Message {
        address sender;
        string message;
        uint256 timestamp;
    }

    Message[] public messages;

    function sendMessage(string calldata message) external {
        require(bytes(message).length > 0, "Empty message");
        require(bytes(message).length <= 280, "Message too long");
        messages.push(Message(msg.sender, message, block.timestamp));
    }

    function getMessages() external view returns (Message[] memory) {
        return messages;
    }
}
```

`sendMessage` is a **write** function — it costs gas because it modifies blockchain state. `getMessages` is a **view** function — it's free to call because it only reads data.

The contract source is included at `ChatRoom.sol` in the project root for reference.

### Deploying

A pre-deployed contract is already available at `0x59a65f35eeAC6211adD3f5399bEd71D782bcf5e6` (see `.env.example`). If you want to deploy your own:

1. Install [Foundry](https://book.getfoundry.sh/getting-started/installation):
   - **macOS / Linux**: `curl -L https://foundry.paradigm.xyz | bash && foundryup`
   - **Windows**: `powershell -c "irm https://foundry.paradigm.xyz | iex"` then run `foundryup`
2. Deploy with `forge create`:
   ```bash
   forge create ChatRoom.sol:ChatRoom \
     --rpc-url https://sepolia.base.org \
     --private-key YOUR_PRIVATE_KEY
   ```
3. Copy the `Deployed to:` address and set it as `PUBLIC_CHAT_ROOM_CONTRACT_ADDRESS` in `.env`
