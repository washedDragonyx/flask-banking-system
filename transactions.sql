DROP TABLE IF EXISTS transactions;


CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL,
  receiver TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transactions (id, sender, receiver, amount) VALUES ('fc98de1a-2e80-4c3f-8dfd-17d3898611dd','6d550f3984a3c798cdbc','0xf283875afe0bba79c', 30.0);
INSERT INTO transactions (id, sender, receiver, amount) VALUES ('08aaee16-96c2-45fd-bc47-e8eae285aa6d','0xec2b36bf1389737f16','6d550f3984a3c798cdbc', 50.0);
