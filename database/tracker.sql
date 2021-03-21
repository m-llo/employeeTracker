DROP DATABASE IF EXISTS emp_trackerdb;
CREATE database emp_trackerdb;

USE emp_trackerdb;

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL(6,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(100) NULL,
  PRIMARY KEY (id)
);