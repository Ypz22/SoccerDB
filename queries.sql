CREATE DATABASE soccerdb;
CREATE TABLE teams(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        city VARCHAR(100),
        stadium VARCHAR(100), year_foundation INT
    );

CREATE TABLE jugadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    edad INT,
    altura DECIMAL(4,2),
    pierna_buena VARCHAR(10),
    club VARCHAR(100)
);


CREATE TABLE technicalDirector(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        nationality VARCHAR(100),
        age INT,
        currentTeam VARCHAR(100),
        yearsExperience INT,
        email VARCHAR(100),
        cellphone VARCHAR(10)
);

    INSERT INTO jugadores (nombre, apellido, edad, altura, pierna_buena, club) VALUES
    ('Damián', 'Díaz', 37, 1.67, 'Derecha', 'Barcelona SC'),
    ('Gabriel', 'Cortéz', 28, 1.78, 'Derecha', 'Barcelona SC'),

    ('Miller', 'Bolaños', 34, 1.70, 'Derecha', 'Emelec'),
    ('Pedro', 'Quiñónez', 38, 1.75, 'Derecha', 'Emelec'),

    ('Alexander', 'Domínguez', 37, 1.95, 'Derecha', 'Liga Deportiva Universitaria de Quito'),
    ('Edison', 'Vega', 34, 1.78, 'Izquierda', 'Liga Deportiva Universitaria de Quito'),

    ('Junior', 'Sornoza', 30, 1.70, 'Derecha', 'Independiente del Valle'),
    ('Lautaro', 'Díaz', 26, 1.84, 'Derecha', 'Independiente del Valle'),

    ('Luis', 'Saritama', 40, 1.78, 'Derecha', 'Deportivo Quito'),
    ('Franklin', 'Salas', 43, 1.68, 'Derecha', 'El Nacional');


    INSERT INTO teams(name, city, stadium, year_foundation)
    VALUES
    ('Barcelona SC', 'Guayaquil', 'Estadio Monumental Banco Pichincha', 1925),
    ('Emelec', 'Guayaquil', 'Estadio George Capwell', 1929),
    ('Liga Deportiva Universitaria de Quito', 'Quito', 'Estadio Rodrigo Paz Delgado', 1930),
    ('Independiente del Valle', 'Sangolquí', 'Estadio Banco Guayaquil', 1958),
    ('Deportivo Quito', 'Quito', 'Estadio Olímpico Atahualpa', 1955),
    ('El Nacional', 'Quito', 'Estadio Olímpico Atahualpa', 1964);

    INSERT INTO technicalDirector (name, nationality, age, currentTeam, yearsExperience, email, cellphone)
    VALUES
    ('Fabián Bustos', 'Argentina', 55, 'Barcelona SC', 20, 'fbustos@barcelonasc.com.ec', '0991122334'),
    ('Hernán Torres', 'Colombia', 63, 'Emelec', 25, 'htorres@emelec.com.ec', '0987654321'),
    ('Luis Zubeldía', 'Argentina', 44, 'Liga Deportiva Universitaria de Quito', 18, 'lzubeldia@lduquito.com.ec', '0995566778'),
    ('Martín Anselmi', 'Argentina', 39, 'Independiente del Valle', 12, 'manselmi@idv.com.ec', '0977123456'),
    ('Nelson Videla', 'Chile', 58, 'Deportivo Quito', 22, 'nvidela@deportivoquito.com.ec', '0963344556'),
    ('Ever Hugo Almeida', 'Paraguay', 76, 'El Nacional', 35, 'ealmeida@elnacional.com.ec', '0999988776');