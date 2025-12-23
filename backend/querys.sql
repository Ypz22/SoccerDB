CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    stadium VARCHAR(100),
    year_foundation INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE technicalDirector (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(100),
    age INT,
    currentTeam VARCHAR(100),
    yearsExperience INT,
    email VARCHAR(100),
    cellphone VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jugadores (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    edad INT,
    altura DECIMAL(4,2),
    pierna_buena VARCHAR(10),
    club VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password, role)
VALUES
('jefferson', 'jefferson@gmail.com', '$2b$10$KIXQx...', 'user');


INSERT INTO teams (user_id, name, city, stadium, year_foundation)
VALUES
(2, 'Barcelona SC', 'Guayaquil', 'Monumental', 1925),
(1, 'Emelec', 'Guayaquil', 'Capwell', 1929);

INSERT INTO technicalDirector
(user_id, name, nationality, age, currentTeam, yearsExperience, email, cellphone)
VALUES
(1, 'Fabián Bustos', 'Argentina', 55, 'Barcelona SC', 20, 'fbustos@barcelona.com', '0991122334');

INSERT INTO jugadores
(user_id, nombre, apellido, edad, altura, pierna_buena, club)
VALUES
(1, 'Damián', 'Díaz', 37, 1.67, 'Derecha', 'Barcelona SC');
