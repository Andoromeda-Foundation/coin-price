# Andoromeda Coin Price Project

## How to use
1. Add config.json
```
{
    "dev":{
        "node_host": "localhost",
        "node_port": 0,
        "mongo_host": "mongo",
        "mongo_port": 27017,
        "cmc_key": "your_cmc_key",
        "mongo_user": "..."
    }
}
```
2. Run Docker
```
# Foreground
docker-compose up --build
# Background
docker-compose up -d --build
```
3. Press Ctrl+C to quit...

## Project Structure
- Based on [Expressjs](https://expressjs.com/) and [Mongodb](https://www.mongodb.com/)

## TBD
- config file generator
- more API format
- API user identity verify
- ~~more coin-pairs~~
- error handler
- ~~log printer~~
- mini calculator
- ...

## Contribute Guide
- under construction