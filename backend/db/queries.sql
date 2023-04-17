-- name: get_temp
SELECT * FROM temp;

-- name: insert_new_user!
INSERT INTO user(email, name, role) 
VALUES (:email, :name, :role)
ON CONFLICT DO NOTHING;