use serde::{Deserialize, Serialize};
use std::error::Error;
use std::fmt;

// Custom error type
#[derive(Debug)]
enum AppError {
    FetchError(String),
    ParseError(String),
    NodeError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::FetchError(msg) => write!(f, "Fetch error: {}", msg),
            AppError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            AppError::NodeError(msg) => write!(f, "Node error: {}", msg),
        }
    }
}

impl Error for AppError {}

// Types
#[derive(Debug, Serialize, Deserialize)]
struct User {
    name: String,
    age: u32,
}

#[derive(Debug)]
struct RepoNode<T> {
    data: T,
    id: String,
}

// Mock functions to simulate the original behavior
fn fetch_current_user() -> Result<String, AppError> {
    // Simulating API call that may fail
    if rand::random() {
        Ok(String::from("{\"name\":\"John\",\"age\":30}"))
    } else {
        Err(AppError::FetchError("Network error".into()))
    }
}

fn parse_data(data: &str) -> Result<User, AppError> {
    serde_json::from_str(data)
        .map_err(|e| AppError::ParseError(e.to_string()))
}

fn modify_node(data: User) -> Result<String, AppError> {
    // Simulating DB operation that may fail
    if data.age > 0 {
        Ok(format!("Saved user: {}", data.name))
    } else {
        Err(AppError::NodeError("Invalid age".into()))
    }
}

fn main() {
    let result = fetch_current_user()
        .and_then(|json| parse_data(&json))
        .and_then(modify_node);

    match result {
        Ok(msg) => println!("Success: {}", msg),
        Err(e) => eprintln!("Failed: {}", e),
    }
}
