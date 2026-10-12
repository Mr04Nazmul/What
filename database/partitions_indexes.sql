-- Matches Table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    league_id INT,
    home_team VARCHAR(100),
    away_team VARCHAR(100),
    start_time TIMESTAMP,
    status VARCHAR(20),
    home_score INT DEFAULT 0,
    away_score INT DEFAULT 0,
    INDEX idx_status (status),
    INDEX idx_start_time (start_time)
);

-- Odds Table (Separated for fast reads)
CREATE TABLE odds (
    id SERIAL PRIMARY KEY,
    match_id INT REFERENCES matches(id),
    selection VARCHAR(10), -- '1', 'X', '2'
    odds_value DECIMAL(5, 2),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_match_id (match_id)
);

-- Bets Table (Partitioned by Month for performance)
CREATE TABLE bets (
    id BIGSERIAL PRIMARY KEY,
    user_id INT,
    match_id INT,
    selection VARCHAR(10),
    stake DECIMAL(15, 2),
    odds DECIMAL(5, 2),
    status VARCHAR(20), -- OPEN, WON, LOST, CASHED_OUT
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_status (user_id, status)
) PARTITION BY RANGE (created_at);
