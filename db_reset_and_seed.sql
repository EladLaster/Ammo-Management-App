-- איפוס כל הטבלאות
TRUNCATE TABLE requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory_users RESTART IDENTITY CASCADE;
TRUNCATE TABLE inventory_admins RESTART IDENTITY CASCADE;
TRUNCATE TABLE items RESTART IDENTITY CASCADE;
TRUNCATE TABLE units RESTART IDENTITY CASCADE;
TRUNCATE TABLE "Users" RESTART IDENTITY CASCADE;

-- הוספת יחידות
INSERT INTO units (name, location) VALUES
  ('יחידה צפון', 'Haifa'),
  ('יחידה מרכז', 'Tel Aviv'),
  ('יחידה דרום', 'Beersheba');

-- הוספת משתמשים (מנהלים ומשתמשים רגילים)
INSERT INTO "Users" (name, role, unit_id, location, internal_email, user_id, username) VALUES
  ('דני מנהל', 'Admin', 1, 'Haifa', 'dani.admin@army.com', NULL, 'daniadmin'),
  ('רוני משתמש', 'User', 1, 'Haifa', 'roni.user@army.com', NULL, 'roniuser'),
  ('אורית משתמשת', 'User', 2, 'Tel Aviv', 'orit.user@army.com', NULL, 'orituser'),
  ('יוסי משתמש', 'User', 3, 'Beersheba', 'yossi.user@army.com', NULL, 'yossiuser');

-- הוספת פריטים
INSERT INTO items (item_name, category) VALUES
  ('M16', 'נשק'),
  ('M4', 'נשק'),
  ('תבור', 'נשק'),
  ('גליל', 'נשק'),
  ('רובה צלפים', 'נשק'),
  ('רימון הלם', 'תחמושת'),
  ('רימון עשן', 'תחמושת'),
  ('מחסנית 5.56', 'תחמושת'),
  ('מחסנית 9 מ"מ', 'תחמושת'),
  ('כדורי סימון', 'תחמושת'),
  ('אפוד', 'ציוד'),
  ('קסדה', 'ציוד'),
  ('פנס ראש', 'ציוד'),
  ('ערכת עזרה ראשונה', 'ציוד'),
  ('שק"ש', 'ציוד');

INSERT INTO inventory_users (unit_id, item_id, quantity) VALUES
  (1, 1, 10), -- יחידה צפון, M16
  (1, 2, 5),  -- יחידה צפון, רימון הלם
  (2, 1, 7),  -- יחידה מרכז, M16
  (2, 3, 12), -- יחידה מרכז, אפוד
  (3, 4, 8);  -- יחידה דרום, קסדה
ה
-- מלאי רב למנהל הדמו (unit_id=1) בטבלת inventory_admins
INSERT INTO inventory_admins (unit_id, item_id, quantity) VALUES
  (1, 1, 100),  -- 100 רובים M16
  (1, 2, 80),   -- 80 רימוני הלם
  (1, 3, 120),  -- 120 אפודים
  (1, 4, 90);   -- 90 קסדות

-- הוספת בקשות (requests)
INSERT INTO requests (user_id, unit_id, item_id, quantity, status) VALUES
  (2, 1, 1, 2, 'pending'),   -- רוני, יחידה צפון, M16
  (2, 1, 2, 1, 'pending'),   -- רוני, יחידה צפון, רימון הלם
  (3, 2, 3, 2, 'approved'),  -- אורית, יחידה מרכז, אפוד
  (4, 3, 4, 1, 'pending');   -- יוסי, יחידה דרום, קסדה
