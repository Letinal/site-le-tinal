-- Schema de la base D1 "letinal" : le tableau des inscrits.
-- Applique avec db-init.bat (ou: npx wrangler d1 execute letinal --file=./schema.sql --remote)

CREATE TABLE IF NOT EXISTS adherents (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  cree_le      TEXT    NOT NULL DEFAULT (datetime('now')),
  saison       TEXT    NOT NULL,            -- ex: "2026"
  prenom       TEXT    NOT NULL,
  nom          TEXT    NOT NULL,
  email        TEXT    NOT NULL,
  telephone    TEXT,
  adresse      TEXT,
  code_postal  TEXT,
  ville        TEXT,
  naissance    TEXT,                        -- date AAAA-MM-JJ (facultatif)
  montant_eur  REAL    NOT NULL DEFAULT 0,
  statut       TEXT    NOT NULL DEFAULT 'a_regler', -- a_regler | paye | annule
  moyen        TEXT,                        -- sumup_en_ligne | sur_place | especes | cheque | virement
  sumup_ref    TEXT,                        -- reference du checkout SumUp
  newsletter   INTEGER NOT NULL DEFAULT 0,  -- 0/1 consentement infos
  benevole     INTEGER NOT NULL DEFAULT 0,  -- 0/1 souhaite aider
  note         TEXT
);

CREATE INDEX IF NOT EXISTS idx_adherents_saison ON adherents(saison);
CREATE INDEX IF NOT EXISTS idx_adherents_email  ON adherents(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_adherents_unique ON adherents(saison, email);
