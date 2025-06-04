use crate::services::etherscan_service::{
    get_balance, get_current_block, get_gas_price, get_transactions,
};
use rocket::get;
use rocket::response::content::RawJson;

#[get("/transactions/<address>")]
pub async fn transactions(address: &str) -> RawJson<String> {
    let info = get_transactions(address).await;
    RawJson(serde_json::to_string(&info).unwrap())
}

#[get("/balance/<address>")]
pub async fn balance(address: &str) -> RawJson<String> {
    let info = get_balance(address).await;
    RawJson(serde_json::to_string(&info).unwrap())
}

#[get("/gas-price")]
pub async fn gas_price() -> RawJson<String> {
    let info = get_gas_price().await;
    RawJson(serde_json::to_string(&info).unwrap())
}

#[get("/current-block")]
pub async fn current_block() -> RawJson<String> {
    let info = get_current_block(None).await;
    RawJson(serde_json::to_string(&info).unwrap())
}
