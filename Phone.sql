CREATE TABLE IF NOT EXISTS `phone_adverts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `text` longtext COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `number` varchar(45) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `phone_bank_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL DEFAULT '0',
  `amount` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL DEFAULT '0',
  `comment` longtext COLLATE utf8mb4_turkish_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `phone_cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `victim` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL DEFAULT '0',
  `judge` varchar(255) COLLATE utf8mb4_turkish_ci NOT NULL DEFAULT '0',
  `date` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `time` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `phone_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `date` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

/*!40000 ALTER TABLE `phone_events` DISABLE KEYS */;
REPLACE INTO `phone_events` (`id`, `time`, `date`) VALUES
	(1, '20:30', '21/12/2021');
/*!40000 ALTER TABLE `phone_events` ENABLE KEYS */;

CREATE TABLE IF NOT EXISTS `phone_mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `sender` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `identifier` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `message` longtext COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `time` longtext COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `phone_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` bigint(20) DEFAULT NULL,
  `messagenumber` bigint(20) DEFAULT NULL,
  `time` int(11) DEFAULT NULL,
  `sonmesaj` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `phone_messagesinner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` bigint(20) NOT NULL DEFAULT 0,
  `gonderenumber` bigint(20) NOT NULL DEFAULT 0,
  `mesaj` varchar(255) DEFAULT NULL,
  `time` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `phone_tweets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `text` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  `attachment` longtext COLLATE utf8mb4_turkish_ci DEFAULT '',
  `name` varchar(255) COLLATE utf8mb4_turkish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_turkish_ci;

CREATE TABLE IF NOT EXISTS `player_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `identifier` (`identifier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;