CREATE DATABASE soccerdb;
CREATE TABLE teams(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        city VARCHAR(100),
        stadium VARCHAR(100), year_foundation INT
    );


    INSERT INTO teams(name, city, stadium, year_foundation)
VALUES
    ('Barcelona SC', 'Guayaquil', 'Estadio Monumental Banco Pichincha', 1925),
    ('Emelec', 'Guayaquil', 'Estadio George Capwell', 1929),
    ('Liga Deportiva Universitaria de Quito', 'Quito', 'Estadio Rodrigo Paz Delgado', 1930),
    ('Independiente del Valle', 'Sangolquí', 'Estadio Banco Guayaquil', 1958),
    ('Deportivo Quito', 'Quito', 'Estadio Olímpico Atahualpa', 1955),
    ('El Nacional', 'Quito', 'Estadio Olímpico Atahualpa', 1964);