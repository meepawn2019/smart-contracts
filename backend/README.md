# Rust Backend Project

This project is a backend service written in Rust. It is organized for scalability and maintainability, following a modular structure.

## Project Structure

- `src/` - Main source code directory
  - `main.rs` - Entry point of the application
  - `services/` - Business logic and service layer
  - `routes/` - API route handlers
  - `models/` - Data models and types
- `Cargo.toml` - Project manifest and dependencies
- `Cargo.lock` - Lock file for reproducible builds

## Getting Started

1. **Install Rust:**

   - Download and install Rust from [rust-lang.org](https://www.rust-lang.org/tools/install)

2. **Build the project:**

   ```sh
   cargo build
   ```

3. **Run the project:**
   ```sh
   cargo run
   ```

## Environment Variables

- `ETHERSCAN_API_KEY` - Etherscan API key
- `REDIS_URL` - Redis URL

Note:
Redis is used to store the gas price but not yet tested.
