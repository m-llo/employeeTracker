DROP DATABASE IF EXISTS emp_trackerdb;
CREATE database emp_trackerdb;

USE emp_trackerdb;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  job_title VARCHAR(50) NULL,
  manager VARCHAR(50) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT(4) NOT NULL AUTO_INCREMENT,
  title VARCHAR(50) NULL,
  department VARCHAR(50) NULL,
  salary DECIMAL(8,2) NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE department (
  id INT(4) NOT NULL,
  dept_name VARCHAR(100) NULL,
  PRIMARY KEY (id)
);

INSERT INTO roles (title, department, salary) values ('HR Coordinator', 'Human Resources', 60000.00);
INSERT INTO roles (title, department, salary) values ('HR Manager', 'Human Resources', 110000.00);
INSERT INTO roles (title, department, salary) values ('Sales Representative', 'Sales', 75000.00);
INSERT INTO roles (title, department, salary) values ('Sales Manager', 'Sales', 150000.00);
INSERT INTO roles (title, department, salary) values ('Marketing Specialist', 'Marketing', 65000.00);
INSERT INTO roles (title, department, salary) values ('Marketing Director', 'Marketing', 135000.00);
INSERT INTO roles (title, department, salary) values ('Accountant', 'Accounting', 70000.00);
INSERT INTO roles (title, department, salary) values ('Accounting Director', 'Accounting', 150000.00);
INSERT INTO roles (title, department, salary) values ('Financial Analyst', 'Finance', 55000.00);
INSERT INTO roles (title, department, salary) values ('Finance Manager', 'Finance', 115000.00);
INSERT INTO roles (title, department, salary) values ('Operations Coordinator', 'Operations', 60000.00);
INSERT INTO roles (title, department, salary) values ('Operations Director', 'Operations', 140000.00);
INSERT INTO roles (title, department, salary) values ('Attorney', 'Legal', 95000.00);
INSERT INTO roles (title, department, salary) values ('General Council', 'Legal', 150000.00);
INSERT INTO roles (title, department, salary) values ('IT Tech', 'Information Technology', 85000.00);
INSERT INTO roles (title, department, salary) values ('IT Manager', 'Information Technology', 110000.00);
INSERT INTO roles (title, department, salary) values ('Executive Officer', 'Exeutive', 250000.00);


INSERT INTO department (id, dept_name) values (100, 'Human Resources');
INSERT INTO department (id, dept_name) values (200, 'Marketing');
INSERT INTO department (id, dept_name) values (300, 'Accounting');
INSERT INTO department (id, dept_name) values (400, 'Finance');
INSERT INTO department (id, dept_name) values (500, 'Operations');
INSERT INTO department (id, dept_name) values (600, 'Legal');
INSERT INTO department (id, dept_name) values (700, 'Information Technology');
INSERT INTO department (id, dept_name) values (800, 'Sales');
INSERT INTO department (id, dept_name) values (900, 'Executive');


