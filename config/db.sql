drop DATABASE if exists portfolio;
CREATE DATABASE portfolio;

USE portfolio;

CREATE TABLE net_worth (
    date DATE PRIMARY KEY,
    net_worth DOUBLE
);


INSERT INTO net_worth (date, net_worth) VALUES
('2025-06-29', 2300150.00),  -- 初始值
('2025-06-30', 2292000.00),  -- 小幅低开
('2025-07-01', 2315000.00),  -- 反弹上涨
('2025-07-02', 2308000.00),  -- 获利回吐
('2025-07-03', 2332000.00),  -- 经济数据利好
('2025-07-04', 2351000.00),  -- 独立日行情 + 买入加仓
('2025-07-05', 2342000.00),  -- 回调
('2025-07-06', 2335000.00),  -- 震荡
('2025-07-07', 2368000.00),  -- AI 股大涨
('2025-07-08', 2361000.00),  -- 冲高回落
('2025-07-09', 2385000.00),  -- 连续买入 + 上涨
('2025-07-10', 2402000.00),  -- 延续趋势
('2025-07-11', 2388000.00),  -- 调整
('2025-07-12', 2421000.00),  -- 突破
('2025-07-13', 2410000.00),  -- 上影线
('2025-07-14', 2435000.00),  -- 再度拉升
('2025-07-15', 2428000.00),  -- 震荡
('2025-07-16', 2452000.00),  -- 温和上涨
('2025-07-17', 2430000.00),  -- 大跌（市场恐慌）
('2025-07-18', 2472000.00),  -- 深V反弹 + 抄底
('2025-07-19', 2495000.00),  -- 反攻开始
('2025-07-20', 2482000.00),  -- 正常波动
('2025-07-21', 2518000.00),  -- 连续上涨
('2025-07-22', 2542000.00),  -- 创新高
('2025-07-23', 2525000.00),  -- 获利盘涌出
('2025-07-24', 2560000.00),  -- 买盘承接 + 加仓
('2025-07-25', 2548000.00),  -- 小幅回调
('2025-07-26', 2585000.00),  -- 周五收高
('2025-07-27', 2602000.00),  -- 持续走强
('2025-07-28', 2628000.00),  -- 延续趋势
('2025-07-29', 2652000.00),  -- 接近目标
('2025-07-30', 2680984.26);  -- 自然收官，涨幅仅 +1.09%

CREATE TABLE cash_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cash
INSERT INTO cash_accounts (name, balance) VALUES
('Fidelity Cash', 2291.90),
('Wells Fargo (Checking)', 309.13),
('Wells Fargo (Savings)', 2000.67);


CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO stock (name) VALUES
('stock1'),
('dexter'),
('wss'),
('hungry');


DROP TABLE IF EXISTS `investments`;

CREATE TABLE `investments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shares` int NOT NULL,
  `symbol` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_updated` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


LOCK TABLES `investments` WRITE;

INSERT INTO `investments` VALUES (9,'ATLANTIC UNION BANKSHARES CO',9782,'AUB','2025-07-30 05:07:42'),(4,'CME GROUP INC',5917,'CME','2025-07-30 05:07:42'),(7,'ISHARES IBONDS 2029 TM HY IN',5123,'IBHI','2025-07-30 05:07:42'),(8,'KRANESHARES MSCI ONE BELT ON',4548,'OBOR','2025-07-30 05:07:42'),(2,'NET POWER INC',6553,'NPWR','2025-07-30 05:07:41'),(5,'PERIMETER ACQUISITION CORP I',9247,'PMTRU','2025-07-30 05:07:42'),(6,'PIMCO RAFI DYNAMIC MULTI-FAC',4929,'MFUS','2025-07-30 05:07:42'),(10,'RHI MAGNESITA NV',1453,'RMGNF','2025-07-30 05:07:42'),(1,'SOUTHERN MICHIGAN BANCORP',5095,'SOMC','2025-07-30 05:07:41'),(3,'TARKU RESOURCES LTD',4247,'TRKUF','2025-07-30 05:07:42');

UNLOCK TABLES;