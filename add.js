const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const {welcome} = require('./index');



const connection = mysql.createConnection({
    multipleStatements: true,
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'crownjewel07',
    database: 'emp_trackerdb',
});

module.exports = {
    addEmployee: () => {
        connection.query('SELECT * FROM department, roles', async (err, results) => {
            if (err) throw err;
            await inquirer
                .prompt([
                    {
                        name: 'emp_firstname',
                        type: 'input',
                        message: 'Enter the first name of the employee.',
                    },
                    {
                        name: 'emp_lastname',
                        type: 'input',
                        message: 'Enter the last name of the employee.',
                    },
                    {
                        name: 'emp_role',
                        type: 'rawlist',
                        message: "Select the employee's role.",
                        choices() {
                            const roleChoiceArray = [];
                            results.forEach(({ title }) => {
                                roleChoiceArray.push(title);
                            });
                            let uniqueRoleChoice = [...new Set(roleChoiceArray)]
                            return uniqueRoleChoice
                        }
                    },
                    {
                        name: 'emp_manager',
                        type: 'input',
                        message: "Enter the managers first and last name",
                    },
                    {
                        name: 'emp_department',
                        type: 'rawlist',
                        message: "Select the employee's department.",
                        choices() {
                            const deptChoiceArray = [];
                            results.forEach(({ dept_name }) => {
                                deptChoiceArray.push(dept_name);
                            });
                            let uniqueDeptChoice = [...new Set(deptChoiceArray)]
                            return uniqueDeptChoice
                        }
                    },
                ])
                .then((answer) => {
                    connection.query(
                        'INSERT INTO employee SET?',
                        {
                            first_name: answer.emp_firstname,
                            last_name: answer.emp_lastname,
                            job_title: answer.emp_role,
                            manager: answer.emp_manager,
    
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log("Employee successfully added.")
                        });
                });
            await welcome();
        });
    },
    
    
    addRole: () => {
        connection.query('SELECT * FROM department', async (err, results) => {
            if (err) throw err;
            await inquirer
                .prompt([
                    {
                        name: 'role_name',
                        type: 'input',
                        message: 'What is the name of the role?',
                    },
                    {
                        name: 'role_salary',
                        type: 'input',
                        message: 'What is the base Salary for this role?',
                    },
                    {
                        name: 'role_department',
                        type: 'rawlist',
                        message: "What department is this role in?",
                        choices() {
                            const deptChoiceArray = [];
                            results.forEach(({ dept_name }) => {
                                deptChoiceArray.push(dept_name);
                            });
                            let uniqueDeptChoice = [...new Set(deptChoiceArray)]
                            return uniqueDeptChoice
                        }
                    },
                ])
                .then((answer) => {
                    connection.query(
                        'INSERT INTO roles SET?',
                        {
                            title: answer.role_name,
                            salary: answer.role_salary,
                            department: answer.role_department,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log("Role successfully created.")
                        })
                })
            await welcome();
        });
    },
    
    addDepartment: () => {
        inquirer
            .prompt([
                {
                    name: 'dept_name',
                    type: 'input',
                    message: 'What is the name of the department?',
                },
                {
                    name: 'dept_id',
                    type: 'input',
                    message: 'Enter a department ID(must be a 4 digit number).',
                },
            ])
            .then((answer) => {
                connection.query(
                    'INSERT INTO department SET?',
                    {
                        id: answer.dept_id,
                        name: answer.dept_name,
                    },
    
                    async (err, res) => {
                        if (err) throw err;
                        await console.log("Department successfully created.")
                        await welcome();
                    })
    
            });
    }
}