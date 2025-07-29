-- create asset
CREATE TABLE `asset` (
  `asset_id` int NOT NULL,
  `share` varchar(48),
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime,
  PRIMARY KEY (`asset_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- create cash
CREATE TABLE `cash` (
  `cash_type` int NOT NULL,
  `balance` varchar(48),
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime,
  PRIMARY KEY (`cash_type`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- create net
CREATE TABLE `net` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime,
  `net_value` varchar(48),
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;