use governor::DefaultDirectRateLimiter;
use governor::{Quota, RateLimiter};
use once_cell::sync::Lazy;
use redis::AsyncCommands;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::num::NonZeroU32;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    pub hash: String,
    pub from: String,
    pub to: String,
    pub value: String,
    pub time_stamp: String,
}

static ETHERSCAN_LIMITER: Lazy<DefaultDirectRateLimiter> =
    Lazy::new(|| RateLimiter::direct(Quota::per_second(NonZeroU32::new(5).unwrap())));

static HTTP_CLIENT: Lazy<Client> = Lazy::new(Client::new);

fn get_api_key() -> String {
    std::env::var("ETHERSCAN_API_KEY").unwrap_or_default()
}

pub async fn get_transactions(address: &str) -> Vec<Transaction> {
    ETHERSCAN_LIMITER.until_ready().await;
    let api_key = get_api_key();
    let client = &*HTTP_CLIENT;
    let url = format!(
        "https://api.etherscan.io/v2/api?module=account&action=tokentx&address={}&sort=desc&apikey={}&chainid=11155111",
        address, api_key
    );
    let result: serde_json::Value = client.get(&url).send().await.unwrap().json().await.unwrap();
    let mut transactions = vec![];
    if let Some(txs) = result["result"].as_array() {
        for tx in txs.iter().take(5) {
            println!("result: {:?}", tx["value"]);
            transactions.push(Transaction {
                hash: tx["hash"].as_str().unwrap_or("").to_string(),
                from: tx["from"].as_str().unwrap_or("").to_string(),
                to: tx["to"].as_str().unwrap_or("").to_string(),
                value: {
                    let wei = tx["value"]
                        .as_str()
                        .unwrap_or("0")
                        .parse::<f64>()
                        .unwrap_or(0.0);
                    (wei / 1e18).to_string()
                },
                time_stamp: tx["timeStamp"].as_str().unwrap_or("").to_string(),
            });
        }
    }
    transactions
}

pub async fn get_balance(address: &str) -> String {
    ETHERSCAN_LIMITER.until_ready().await;
    let api_key = get_api_key();
    let client = &*HTTP_CLIENT;
    let url = format!(
        "https://api.etherscan.io/v2/api?module=account&action=balance&address={}&tag=latest&apikey={}&chainid=11155111",
        address, api_key
    );
    let balance_result: serde_json::Value =
        client.get(&url).send().await.unwrap().json().await.unwrap();
    let balance = balance_result["result"].as_str().unwrap_or("");
    let balance_wei = balance.parse::<u128>().unwrap_or(0);
    let balance_eth = balance_wei as f64 / 1e18;
    balance_eth.to_string()
}

async fn get_redis_conn() -> Result<redis::aio::Connection, redis::RedisError> {
    let client = redis::Client::open(
        std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1/".to_string()),
    )?;
    client.get_async_connection().await
}

pub async fn get_gas_price() -> String {
    ETHERSCAN_LIMITER.until_ready().await;
    let mut conn = match get_redis_conn().await.ok() {
        Some(conn) => Some(conn),
        None => None,
    };
    if let Some(ref mut c) = conn {
        if let Ok(cached) = c.get::<_, String>("gas_price").await {
            if !cached.is_empty() {
                return cached;
            }
        }
    }
    let api_key = get_api_key();
    let client = &*HTTP_CLIENT;
    let url = format!(
        "https://api.etherscan.io/v2/api?module=gastracker&action=gasoracle&apikey={}&chainid=11155111",
        api_key
    );
    let gas_price_result: serde_json::Value =
        client.get(&url).send().await.unwrap().json().await.unwrap();
    let gas_price = gas_price_result["result"]
        .as_str()
        .unwrap_or("")
        .to_string();
    if let Some(ref mut c) = conn {
        let _: () = c.set_ex("gas_price", &gas_price, 10).await.unwrap();
    }
    gas_price
}

pub async fn get_current_block(timestamp: Option<u64>) -> String {
    ETHERSCAN_LIMITER.until_ready().await;
    let mut conn = match get_redis_conn().await.ok() {
        Some(conn) => Some(conn),
        None => None,
    };
    if let Some(ref mut c) = conn {
        if let Ok(cached) = c.get::<_, String>("current_block").await {
            if !cached.is_empty() {
                return cached;
            }
        }
    }
    let api_key = get_api_key();
    let timestamp = timestamp.unwrap_or_else(|| {
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
    });
    let client = &*HTTP_CLIENT;
    let url = format!(
        "https://api.etherscan.io/v2/api?module=block&action=getblocknobytime&timestamp={}&closest=before&apikey={}&chainid=11155111",
        timestamp, api_key
    );
    let result: serde_json::Value = client.get(&url).send().await.unwrap().json().await.unwrap();
    let block = result["result"].as_str().unwrap_or("").to_string();
    if let Some(ref mut c) = conn {
        let _: () = c.set_ex("current_block", &block, 10).await.unwrap();
    }
    block
}
