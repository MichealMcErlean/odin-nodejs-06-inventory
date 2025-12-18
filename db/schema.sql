DROP TABLE IF EXISTS game_genres, game_platforms, games, platforms, developers, publishers, genres CASCADE;

CREATE TABLE IF NOT EXISTS platforms (
  platform_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  platform TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS developers (
  developer_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  developer TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS publishers (
  publisher_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  publisher TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  genre TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  game_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  price NUMERIC(12, 2),
  quantity INTEGER DEFAULT 0,
  release_date DATE,
  developer_id INTEGER REFERENCES developers(developer_id) ON DELETE CASCADE,
  publisher_id INTEGER REFERENCES publishers(publisher_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_genres(
  game_id INTEGER REFERENCES games(game_id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS game_platforms (
  game_id INTEGER REFERENCES games(game_id) ON DELETE CASCADE,
  platform_id INTEGER REFERENCES platforms(platform_id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, platform_id)
);

-- VIEWS
-- View for games
CREATE OR REPLACE VIEW game_library AS
SELECT 
    g.game_id,
    g.name,
    g.price,
    g.quantity,
    g.release_date,
    g.developer_id,
    d.developer,
    g.publisher_id,
    p.publisher,
    -- for triggers to see the data
    ARRAY_AGG(DISTINCT gp.platform_id) as platform_ids,
    ARRAY_AGG(DISTINCT gg.genre_id) as genre_ids,
    -- for UI
    STRING_AGG(DISTINCT pl.platform, ', ') AS platforms,
    STRING_AGG(DISTINCT gn.genre, ', ') AS genres
FROM games g
LEFT JOIN developers d ON g.developer_id = d.developer_id
LEFT JOIN publishers p ON g.publisher_id = p.publisher_id
LEFT JOIN game_platforms gp ON g.game_id = gp.game_id
LEFT JOIN platforms pl ON gp.platform_id = pl.platform_id
LEFT JOIN game_genres gg ON g.game_id = gg.game_id
JOIN genres gn ON gg.genre_id = gn.genre_id
GROUP BY g.game_id, d.developer, p.publisher;

-- TRIGGER FUNCTIONS
-- Insert on game_library
CREATE OR REPLACE FUNCTION insert_game_via_view()
RETURNS TRIGGER AS $$
DECLARE
    new_game_id INTEGER;
BEGIN
    -- 1. Insert into the main games table
    INSERT INTO games (name, price, quantity, release_date, developer_id, publisher_id)
    VALUES (NEW.name, NEW.price, NEW.quantity, NEW.release_date, NEW.developer_id, NEW.publisher_id)
    RETURNING game_id INTO new_game_id;

    -- 2. Handle Many-to-Many Platforms
    -- This assumes you pass an array of platform_ids in a new column or handle it via a temp link
    -- For simplicity, let's say your website passes the ID directly
    IF NEW.platform_ids IS NOT NULL THEN
        INSERT INTO game_platforms (game_id, platform_id) SELECT new_game_id, UNNEST(NEW.platform_ids);
    END IF;

    -- 3. Handle Many-to-Many Genres
    IF NEW.genre_ids IS NOT NULL THEN
        INSERT INTO game_genres (game_id, genre_id) SELECT new_game_id, UNNEST(NEW.genre_ids);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update into game_library
CREATE OR REPLACE FUNCTION update_game_via_view()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Update the core game details
    UPDATE games 
    SET name = NEW.name,
        price = NEW.price,
        quantity = NEW.quantity,
        release_date = NEW.release_date,
        developer_id = NEW.developer_id,
        publisher_id = NEW.publisher_id
    WHERE game_id = OLD.game_id;

    DELETE FROM game_platforms WHERE game_id = OLD.game_id;
    IF NEW.platform_ids IS NOT NULL THEN
        INSERT INTO game_platforms (game_id, platform_id)
        SELECT OLD.game_id, unnest(NEW.platform_ids);
    END IF;

    -- 3. Sync Genres: Delete old links, then insert the new array
    DELETE FROM game_genres WHERE game_id = OLD.game_id;
    IF NEW.genre_ids IS NOT NULL THEN
        INSERT INTO game_genres (game_id, genre_id)
        SELECT OLD.game_id, unnest(NEW.genre_ids);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Delete on game_library
CREATE OR REPLACE FUNCTION delete_game_via_view()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM games WHERE game_id = OLD.game_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS
CREATE TRIGGER trigger_insert_game
INSTEAD OF INSERT ON game_library
FOR EACH ROW EXECUTE FUNCTION insert_game_via_view();

CREATE TRIGGER trigger_update_game
INSTEAD OF UPDATE ON game_library
FOR EACH ROW EXECUTE FUNCTION update_game_via_view();

CREATE TRIGGER trigger_delete_game
INSTEAD OF DELETE ON game_library
FOR EACH ROW EXECUTE FUNCTION delete_game_via_view();

-- INSERTIONS
-- Platforms
INSERT INTO platforms (platform) 
VALUES ('PC'), ('PlayStation 5'), ('Xbox Series X'), ('Nintendo Switch')
RETURNING *;

-- Developers & Publishers
INSERT INTO developers (developer) VALUES ('FromSoftware'), ('CD Projekt Red');
INSERT INTO publishers (publisher) VALUES ('Bandai Namco'), ('CD Projekt');

-- Genres
INSERT INTO genres (genre) VALUES ('RPG'), ('Action'), ('Open World');

INSERT INTO games (name, price, quantity, release_date, developer_id, publisher_id)
VALUES 
  ('Elden Ring', 59.99, 100, '2022-02-25', 1, 1),
  ('Cyberpunk 2077', 49.99, 50, '2020-12-10', 2, 2);

-- Link Elden Ring to multiple platforms
INSERT INTO game_platforms (game_id, platform_id)
VALUES 
  (1, 1), -- PC : Elden Ring
  (1, 2), -- PS5
  (1, 3), -- Xbox
  (2, 1), -- PC : Cyberpunk 2077
  (2, 2), -- PS5
  (2, 3); -- Xbox

-- Link Elden Ring to multiple genres
INSERT INTO game_genres (game_id, genre_id)
VALUES 
  (1, 1), -- Elden Ring: RPG
  (1, 2), -- Action
  (1, 3), -- Open World
  (2, 1), -- Cyberpunk 2077: RPG
  (2, 2), -- Action
  (2, 3); -- Open World