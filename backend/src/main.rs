#[macro_use]
extern crate rocket;

use dotenv::dotenv;
use rocket_cors::CorsOptions;

mod models;
mod routes;
mod services;

#[launch]
fn rocket() -> _ {
    dotenv().ok();
    let cors = CorsOptions::default().to_cors().unwrap();
    rocket::build().attach(cors).mount(
        "/api",
        routes![
            routes::etherscan::transactions,
            routes::etherscan::balance,
            routes::etherscan::gas_price,
            routes::etherscan::current_block,
        ],
    )
}
