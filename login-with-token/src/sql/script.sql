CREATE DATABASE node_login;

USE node_login;

CREATE TABLE users (
  `user_id` smallint(6) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(50) NOT NULL UNIQUE,
  `pass` varchar(50) NOT NULL
)