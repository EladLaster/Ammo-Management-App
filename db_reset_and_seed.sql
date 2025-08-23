-- איפוס כל הטבלאות
TRUNCATE TABLE requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory_users RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory_admins RESTART IDENTITY CASCADE;
TRUNCATE TABLE items RESTART IDENTITY CASCADE;
TRUNCATE TABLE units RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE;

INSERT INTO units (name, location) VALUES
  ('יחידה צפון', 'Haifa'),   -- id=1
  ('יחידה מרכז', 'Tel Aviv'),-- id=2
  ('יחידה דרום', 'Beersheba');-- id=3

INSERT INTO "Users" (name, role, unit_id, location, internal_email, user_id, username) VALUES
  ('דני מנהל', 'Admin', 1, 'Haifa', 'dani.admin@army.com', NULL, 'daniadmin'),   -- id=1
  ('רוני משתמש', 'User', 1, 'Haifa', 'roni.user@army.com', NULL, 'roniuser'),    -- id=2
  ('אורית משתמשת', 'User', 2, 'Tel Aviv', 'orit.user@army.com', NULL, 'orituser'),-- id=3
  ('יוסי משתמש', 'User', 3, 'Beersheba', 'yossi.user@army.com', NULL, 'yossiuser');-- id=4

INSERT INTO items (item_name, category) VALUES
  ('M16', 'נשק'),            -- id=1
  ('M4A1', 'נשק'),           -- id=2
  ('תבור X95', 'נשק'),       -- id=3
  ('גליל ACE', 'נשק'),       -- id=4
  ('רובה צלפים ברט', 'נשק'), -- id=5
  ('רימון הלם', 'תחמושת'),   -- id=6
  ('רימון עשן', 'תחמושת'),   -- id=7
  ('מחסנית 5.56', 'תחמושת'), -- id=8
  ('מחסנית 7.62', 'תחמושת'), -- id=9
  ('פצצת תאורה', 'תחמושת'),  -- id=10
  ('אפוד קרמי', 'ציוד'),     -- id=11
  ('קסדה בליסטית', 'ציוד'),  -- id=12
  ('פנס ראש', 'ציוד'),       -- id=13
  ('ערכת עזרה ראשונה', 'ציוד'),-- id=14
  ('שק"ש קל', 'ציוד');       -- id=15

INSERT INTO inventory_users (unit_id, item_id, quantity) VALUES
  (1, 1, 10),  -- יחידה צפון, M16
  (1, 6, 5),   -- יחידה צפון, רימון הלם
  (1, 11, 7),  -- יחידה צפון, אפוד
  (2, 2, 8),   -- יחידה מרכז, M4
  (2, 7, 4),   -- יחידה מרכז, רימון עשן
  (2, 12, 6),  -- יחידה מרכז, קסדה
  (3, 3, 9),   -- יחידה דרום, תבור
  (3, 8, 3),   -- יחידה דרום, מחסנית 5.56
  (3, 13, 5);  -- יחידה דרום, פנס ראש
ה
INSERT INTO inventory_admins (unit_id, item_id, quantity) VALUES
  (1, 1, 100),  -- M16
  (1, 2, 100),  -- M4
  (1, 3, 100),  -- תבור
  (1, 4, 100),  -- גליל
  (1, 5, 100),  -- רובה צלפים
  (1, 6, 100),  -- רימון הלם
  (1, 7, 100),  -- רימון עשן
  (1, 8, 100),  -- מחסנית 5.56
  (1, 9, 100),  -- מחסנית 9 מ"מ
  (1, 10, 100), -- כדורי סימון
  (1, 11, 100), -- אפוד
  (1, 12, 100), -- קסדה ליחידה 1
  (1, 13, 100), -- פנס ראש
  (1, 14, 100), -- ערכת עזרה ראשונה
  (1, 15, 100), -- שק"ש
  (2, 12, 13);  -- 13 קסדות ליחידה 2

INSERT INTO requests (user_id, unit_id, item_id, quantity, status) VALUES
  (2, 1, 1, 2, 'pending'),    -- רוני, יחידה צפון, M16
  (2, 1, 6, 1, 'pending'),    -- רוני, יחידה צפון, רימון הלם
  (3, 2, 2, 3, 'pending'),    -- אורית, יחידה מרכז, M4
  (3, 2, 7, 2, 'approved'),   -- אורית, יחידה מרכז, רימון עשן
  (4, 3, 3, 1, 'pending'),    -- יוסי, יחידה דרום, תבור
  (4, 3, 8, 2, 'pending');    -- יוסי, יחידה דרום, מחסנית 5.56
