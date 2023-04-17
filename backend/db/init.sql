CREATE TABLE user (
    user_id BIGSERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    room VARCHAR(255) NOT NULL,
    role VARCHAR(15) NOT NULL
);

CREATE TABLE package (
    package_id BIGSERIAL NOT NULL PRIMARY KEY,
    package_number VARCHAR(255) NOT NULL UNIQUE,
    package_type VARCHAR(20),
    status INT DEFAULT 0,
    owner_name VARCHAR(255),
    arrival TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE package_collection (
    collected_package_id INT,
    collected_by_email VARCHAR(255),
    collection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collected_package_id) REFERENCES package(package_id),
    FOREIGN KEY (collected_by_email) REFERENCES user(email)
);