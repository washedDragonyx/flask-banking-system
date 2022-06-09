DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  account_id TEXT NOT NULL,
  balance INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts (name, surname, account_id, balance) VALUES ('nikola','zjacic', '0xec2b36bf1389737f16', 100);