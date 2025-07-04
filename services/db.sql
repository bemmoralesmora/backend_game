CREATE TABLE Cartas (
    id_cartas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    valor VARCHAR(255) NOT NULL
);


CREATE TABLE Codigos (
    id_codigos INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Codigos VARCHAR(255) NOT NULL
);

CREATE TABLE Estadisticas (
    id_estadisticas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    puntos VARCHAR(255)
);

CREATE TABLE Registro (
    id_registro INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL
);


CREATE TABLE Login (
    id_login INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    id_registro INT NOT NULL,
    FOREIGN KEY (id_registro) REFERENCES Registro(id_registro)
);

CREATE TABLE Partidas (
    id_partidas INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuarios INT,
    nombre_partida VARCHAR(255) NOT NULL,
    numero_jugadores INT NOT NULL,
    numero_nivel INT NOT NULL,
    codigo_generado VARCHAR(100) NOT NULL,
    dificultad ENUM('facil','intermedio','dificil') NOT NULL DEFAULT 'facil',
    tipo_partida ENUM('publica','privada') NOT NULL DEFAULT 'publica',
    estado ENUM('esperando','comenzado','finalizada') NOT NULL DEFAULT 'esperando',
    FOREIGN KEY (id_usuarios) REFERENCES Login(id_login)
);

CREATE TABLE UsuariosLogin (
    id_login INT NOT NULL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    puntos VARCHAR(255) NOT NULL,
    id_estadisticas INT NOT NULL,
    id_partidas INT NOT NULL,
    FOREIGN KEY (id_login) REFERENCES Login(id_login),
    FOREIGN KEY (id_estadisticas) REFERENCES Estadisticas(id_estadisticas),
    FOREIGN KEY (id_partidas) REFERENCES Partidas(id_partidas)
);
