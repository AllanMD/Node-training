CREATE DATABASE node_mysql;

USE node_mysql;

CREATE TABLE users (
  `user_id` smallint(6) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL
)