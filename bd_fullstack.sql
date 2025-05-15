-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-04-2025 a las 21:11:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_fullstack`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `PROC_AGREGAR_ROL` (IN `pTipo` VARCHAR(100), IN `pPermisos` JSON)   BEGIN
    DECLARE vRoleID INT;
    DECLARE vIndex  INT DEFAULT 0;
    DECLARE vTotal  INT DEFAULT 0;
    DECLARE vRuta   VARCHAR(255);
    DECLARE error_msg VARCHAR(255); -- Variable para el mensaje de error

    -- Validar nombre no vacío
    IF pTipo IS NULL OR TRIM(pTipo) = '' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El nombre del rol no puede estar vacío.';
    END IF;

    -- Validar rol existente
    IF EXISTS (SELECT 1 FROM tb_rol WHERE tipo = pTipo) THEN
        SET error_msg = CONCAT('El rol ''', pTipo, ''' ya existe.'); -- Usar variable intermedia
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = error_msg;
    END IF;

    -- Insertar nuevo rol
    INSERT INTO tb_rol (tipo) VALUES (pTipo);
    SET vRoleID = LAST_INSERT_ID();

    -- Procesar permisos
    IF pPermisos IS NOT NULL AND JSON_VALID(pPermisos) THEN
        SET vTotal = JSON_LENGTH(pPermisos);
        WHILE vIndex < vTotal DO
            SET vRuta = JSON_UNQUOTE(JSON_EXTRACT(pPermisos, CONCAT('$[', vIndex, ']')));
            
            INSERT IGNORE INTO tb_permissions (ruta) VALUES (vRuta);
            
            INSERT IGNORE INTO tb_role_permissions (role_id, permission_id)
            SELECT vRoleID, id 
              FROM tb_permissions 
             WHERE ruta = vRuta;
            
            SET vIndex = vIndex + 1;
        END WHILE;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `PROC_EDITAR_ROL` (IN `pID` INT, IN `pTipo` VARCHAR(100), IN `pPermisos` JSON)   BEGIN
    DECLARE vIndex     INT DEFAULT 0;
    DECLARE vTotal     INT DEFAULT 0;
    DECLARE vRuta      VARCHAR(255);
    DECLARE error_msg  VARCHAR(255);

    -- 1) Validar nombre no vacío
    IF pTipo IS NULL OR TRIM(pTipo) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre del rol no puede estar vacío.';
    END IF;

    -- 2) Validar que no exista otro rol con mismo nombre
    IF EXISTS (
        SELECT 1 
          FROM tb_rol 
         WHERE tipo = pTipo 
           AND idRol <> pID
    ) THEN
        SET error_msg = CONCAT('El rol ''', pTipo, ''' ya existe con otro ID.');
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = error_msg;
    END IF;

    -- 3) Actualizar nombre del rol
    UPDATE tb_rol
       SET tipo = pTipo
     WHERE idRol = pID;

    -- 4) Eliminar permisos anteriores
    DELETE FROM tb_role_permissions
     WHERE role_id = pID;

    -- 5) Insertar nuevos permisos
    IF pPermisos IS NOT NULL AND JSON_VALID(pPermisos) THEN
        SET vTotal = JSON_LENGTH(pPermisos);
        WHILE vIndex < vTotal DO
            SET vRuta = JSON_UNQUOTE(
                JSON_EXTRACT(pPermisos, CONCAT('$[', vIndex, ']'))
            );

            INSERT IGNORE INTO tb_permissions (ruta) VALUES (vRuta);

            INSERT IGNORE INTO tb_role_permissions (role_id, permission_id)
            SELECT pID, id
              FROM tb_permissions
             WHERE ruta = vRuta;

            SET vIndex = vIndex + 1;
        END WHILE;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camiones`
--

CREATE TABLE `camiones` (
  `id_camion` int(11) NOT NULL,
  `placa` varchar(9) DEFAULT NULL,
  `modelo` varchar(30) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `camiones`
--

INSERT INTO `camiones` (`id_camion`, `placa`, `modelo`, `estado`) VALUES
(1, 'BC12-3', 'Toyota', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conductores`
--

CREATE TABLE `conductores` (
  `id_conductor` int(11) NOT NULL,
  `nombre` varchar(70) DEFAULT NULL,
  `dni` int(11) DEFAULT NULL,
  `correo` varchar(70) DEFAULT NULL,
  `destino` varchar(70) DEFAULT NULL,
  `licencia` varchar(20) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `conductores`
--

INSERT INTO `conductores` (`id_conductor`, `nombre`, `dni`, `correo`, `destino`, `licencia`, `estado`) VALUES
(1, 'Jose', 74638387, 'vilcabana@gmail.com', 'Chiclayo', 'BBB-01', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrega`
--

CREATE TABLE `entrega` (
  `id_entrega` int(11) NOT NULL,
  `id_ruta` int(11) DEFAULT NULL,
  `id_conductor` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` tinyint(4) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entrega`
--

INSERT INTO `entrega` (`id_entrega`, `id_ruta`, `id_conductor`, `fecha`, `estado`, `direccion`) VALUES
(1, 1, 1, '2025-04-26', 0, 'AV. ALFREDO MENDIOLA NRO. 3520 LIMA LIMA INDEPENDENCIA'),
(2, 1, 1, '2025-04-26', 1, 'Av. Principal 679'),
(3, 1, 1, '2025-04-26', 1, 'AV. ALFREDO MENDIOLA NRO. 3520');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ruta`
--

CREATE TABLE `ruta` (
  `id_ruta` int(11) NOT NULL,
  `origin` varchar(70) DEFAULT NULL,
  `destino` varchar(70) DEFAULT NULL,
  `estado` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ruta`
--

INSERT INTO `ruta` (`id_ruta`, `origin`, `destino`, `estado`) VALUES
(1, 'Lima', 'Chiclayo', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tareas_asignadas`
--

CREATE TABLE `tareas_asignadas` (
  `id_tarea` int(11) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_conductor` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` tinyint(4) DEFAULT NULL,
  `id_entrega` int(11) DEFAULT NULL,
  `id_camion` int(11) DEFAULT NULL,
  `id_ruta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tareas_asignadas`
--

INSERT INTO `tareas_asignadas` (`id_tarea`, `descripcion`, `id_usuario`, `id_conductor`, `fecha_inicio`, `fecha_fin`, `estado`, `id_entrega`, `id_camion`, `id_ruta`) VALUES
(1, 'Vijando a ver a ella ', 1, 1, '2025-04-26', '2025-04-26', 1, 2, 1, 1),
(2, 'ok', 1, 1, '2025-04-27', '2025-04-27', 1, 1, 1, 1),
(3, 'ok', 1, 1, '2025-04-27', '2025-04-27', 1, 1, 1, 1),
(4, 'ok', 1, 1, '2025-04-27', '2025-04-27', 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_permissions`
--

CREATE TABLE `tb_permissions` (
  `id` int(11) NOT NULL,
  `ruta` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tb_permissions`
--

INSERT INTO `tb_permissions` (`id`, `ruta`) VALUES
(1, '/pages'),
(5, '/pages/chatboot/seguridad'),
(22, '/pages/Conductores'),
(23, '/pages/Entregas'),
(4, '/pages/Operaciones'),
(3, '/pages/Rol'),
(25, '/pages/RutaViaje'),
(24, '/pages/Tareas'),
(2, '/pages/Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_rol`
--

CREATE TABLE `tb_rol` (
  `idRol` int(11) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tb_rol`
--

INSERT INTO `tb_rol` (`idRol`, `tipo`) VALUES
(1, 'Administrador'),
(2, 'Conductor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tb_role_permissions`
--

CREATE TABLE `tb_role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tb_role_permissions`
--

INSERT INTO `tb_role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(2, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `usuario` char(8) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `correo` varchar(300) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `idRol` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `usuario`, `password`, `imagen`, `correo`, `telefono`, `idRol`) VALUES
(1, '74638387', '$2b$10$F0Gs10PV8eQm7HF/cojxWOMQr90SOqWUPbAuaoOnhGHJ6HvIonBO6', NULL, NULL, NULL, 1),
(2, '76313561', '$2b$10$SOai49IXRTbaQEKl6a3hgOXPooPoluw0lFCwoCyUxFtvxg3QluIKu', NULL, NULL, NULL, 2);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_permisos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_permisos` (
`rol` varchar(100)
,`role_id` int(11)
,`permisos` varchar(255)
,`permission_id` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_tarea`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_tarea` (
`ID` int(11)
,`descripcion` varchar(200)
,`entrega` varchar(150)
,`usuario` char(8)
,`conductor` varchar(70)
,`modelo` varchar(30)
,`ruta` varchar(143)
,`fecha_inicio` date
,`fecha_fin` date
,`estado` tinyint(4)
,`id_usuario` int(11)
,`id_conductor` int(11)
,`id_camion` int(11)
,`id_ruta` int(11)
,`id_entrega` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_usuario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_usuario` (
`id_usuario` int(11)
,`imagen` varchar(255)
,`usuario` char(8)
,`password` varchar(60)
,`rol` varchar(100)
,`idRol` int(11)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_permisos`
--
DROP TABLE IF EXISTS `vista_permisos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_permisos`  AS SELECT `r`.`tipo` AS `rol`, `rp`.`role_id` AS `role_id`, `p`.`ruta` AS `permisos`, `rp`.`permission_id` AS `permission_id` FROM ((`tb_role_permissions` `rp` join `tb_rol` `r` on(`r`.`idRol` = `rp`.`role_id`)) join `tb_permissions` `p` on(`p`.`id` = `rp`.`permission_id`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_tarea`
--
DROP TABLE IF EXISTS `vista_tarea`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_tarea`  AS SELECT `ta`.`id_tarea` AS `ID`, `ta`.`descripcion` AS `descripcion`, `e`.`direccion` AS `entrega`, `u`.`usuario` AS `usuario`, `cd`.`nombre` AS `conductor`, `c`.`modelo` AS `modelo`, concat(`r`.`origin`,' → ',`r`.`destino`) AS `ruta`, `ta`.`fecha_inicio` AS `fecha_inicio`, `ta`.`fecha_fin` AS `fecha_fin`, `ta`.`estado` AS `estado`, `ta`.`id_usuario` AS `id_usuario`, `ta`.`id_conductor` AS `id_conductor`, `ta`.`id_camion` AS `id_camion`, `ta`.`id_ruta` AS `id_ruta`, `ta`.`id_entrega` AS `id_entrega` FROM (((((`tareas_asignadas` `ta` join `usuario` `u` on(`u`.`id_usuario` = `ta`.`id_usuario`)) left join `conductores` `cd` on(`cd`.`id_conductor` = `ta`.`id_conductor`)) left join `camiones` `c` on(`c`.`id_camion` = `ta`.`id_camion`)) left join `ruta` `r` on(`r`.`id_ruta` = `ta`.`id_ruta`)) left join `entrega` `e` on(`e`.`id_entrega` = `ta`.`id_entrega`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_usuario`
--
DROP TABLE IF EXISTS `vista_usuario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_usuario`  AS SELECT `u`.`id_usuario` AS `id_usuario`, `u`.`imagen` AS `imagen`, `u`.`usuario` AS `usuario`, `u`.`password` AS `password`, `r`.`tipo` AS `rol`, `u`.`idRol` AS `idRol` FROM (`usuario` `u` join `tb_rol` `r` on(`r`.`idRol` = `u`.`idRol`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `camiones`
--
ALTER TABLE `camiones`
  ADD PRIMARY KEY (`id_camion`);

--
-- Indices de la tabla `conductores`
--
ALTER TABLE `conductores`
  ADD PRIMARY KEY (`id_conductor`);

--
-- Indices de la tabla `entrega`
--
ALTER TABLE `entrega`
  ADD PRIMARY KEY (`id_entrega`),
  ADD KEY `id_ruta` (`id_ruta`),
  ADD KEY `id_conductor` (`id_conductor`);

--
-- Indices de la tabla `ruta`
--
ALTER TABLE `ruta`
  ADD PRIMARY KEY (`id_ruta`);

--
-- Indices de la tabla `tareas_asignadas`
--
ALTER TABLE `tareas_asignadas`
  ADD PRIMARY KEY (`id_tarea`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_conductor` (`id_conductor`),
  ADD KEY `fk_id_entrega` (`id_entrega`),
  ADD KEY `fk_id_camion` (`id_camion`),
  ADD KEY `fk_id_ruta` (`id_ruta`);

--
-- Indices de la tabla `tb_permissions`
--
ALTER TABLE `tb_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_ruta` (`ruta`);

--
-- Indices de la tabla `tb_rol`
--
ALTER TABLE `tb_rol`
  ADD PRIMARY KEY (`idRol`);

--
-- Indices de la tabla `tb_role_permissions`
--
ALTER TABLE `tb_role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `idRol` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `camiones`
--
ALTER TABLE `camiones`
  MODIFY `id_camion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `conductores`
--
ALTER TABLE `conductores`
  MODIFY `id_conductor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `entrega`
--
ALTER TABLE `entrega`
  MODIFY `id_entrega` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `ruta`
--
ALTER TABLE `ruta`
  MODIFY `id_ruta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tareas_asignadas`
--
ALTER TABLE `tareas_asignadas`
  MODIFY `id_tarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tb_permissions`
--
ALTER TABLE `tb_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `tb_rol`
--
ALTER TABLE `tb_rol`
  MODIFY `idRol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entrega`
--
ALTER TABLE `entrega`
  ADD CONSTRAINT `entrega_ibfk_1` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id_ruta`),
  ADD CONSTRAINT `entrega_ibfk_2` FOREIGN KEY (`id_conductor`) REFERENCES `conductores` (`id_conductor`);

--
-- Filtros para la tabla `tareas_asignadas`
--
ALTER TABLE `tareas_asignadas`
  ADD CONSTRAINT `fk_id_camion` FOREIGN KEY (`id_camion`) REFERENCES `camiones` (`id_camion`),
  ADD CONSTRAINT `fk_id_entrega` FOREIGN KEY (`id_entrega`) REFERENCES `entrega` (`id_entrega`),
  ADD CONSTRAINT `fk_id_ruta` FOREIGN KEY (`id_ruta`) REFERENCES `ruta` (`id_ruta`),
  ADD CONSTRAINT `tareas_asignadas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `tareas_asignadas_ibfk_2` FOREIGN KEY (`id_conductor`) REFERENCES `conductores` (`id_conductor`);

--
-- Filtros para la tabla `tb_role_permissions`
--
ALTER TABLE `tb_role_permissions`
  ADD CONSTRAINT `tb_role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `tb_rol` (`idRol`),
  ADD CONSTRAINT `tb_role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `tb_permissions` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `tb_rol` (`idRol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
