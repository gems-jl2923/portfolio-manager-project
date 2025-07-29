CREATE DATABASE portfolio;

USE portfolio;

CREATE TABLE net_worth (
    date DATE PRIMARY KEY,
    net_worth DOUBLE
);

INSERT INTO net_worth (date, net_worth)
VALUES
('2025-06-29', 2300100.00),
('2025-06-30', 2300500.00),
('2025-07-01', 2300900.00),
('2025-07-02', 2301300.00),
('2025-07-03', 2301700.00),
('2025-07-04', 2302100.00),
('2025-07-05', 2302500.00),
('2025-07-06', 2302900.00),
('2025-07-07', 2303300.00),
('2025-07-08', 2303700.00),
('2025-07-09', 2304100.00),
('2025-07-10', 2304500.00),
('2025-07-11', 2304900.00),
('2025-07-12', 2305300.00),
('2025-07-13', 2305700.00),
('2025-07-14', 2306100.00),
('2025-07-15', 2306500.00),
('2025-07-16', 2306900.00),
('2025-07-17', 2307300.00),
('2025-07-18', 2307700.00),
('2025-07-19', 2308100.00),
('2025-07-20', 2308500.00),
('2025-07-21', 2308900.00),
('2025-07-22', 2309300.00),
('2025-07-23', 2309700.00),
('2025-07-24', 2310100.00),
('2025-07-25', 2310500.00),
('2025-07-26', 2310900.00),
('2025-07-27', 2311300.00),
('2025-07-28', 2317000.00);


CREATE TABLE cash_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    shares INT NOT NULL,
    total_value DECIMAL(15, 2) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cash
INSERT INTO cash_accounts (name, balance) VALUES
('Fidelity Cash', 2291.90),
('Wells Fargo (Checking)', 309.13),
('Wells Fargo (Savings)', 2000.67);

-- Investments
INSERT INTO investments (name, shares, total_value) VALUES
('Beneke Fabricators', 12, 16231.00),
('Fidelity Brokerage', 30, 53165.79),
('Pershing (IRA 1)', 60, 456191.03),
('Stock Options - Pandora', 5, 31715.00);

-- select * from cash_accounts;
-- select * from investments;

-- UPDATE investments
-- SET total_value = 6500.00, shares = 30, last_updated = NOW()
-- WHERE id = 1;
