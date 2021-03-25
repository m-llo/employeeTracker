const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const ascii = require('ascii-art');
const {updateEmployee, updateRoles, updateDepartment} = require('./update');
const {addEmployee, addRole, addDepartment} = require('./add');



// create the connection information for the sql database
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


const welcome = () => {
   

    inquirer
        .prompt([
            {
                name: 'options',
                type: 'rawlist',
                message: 'What would you like to do?',
                choices: ['Add Record', 'View Record', 'Update Record', 'Delete Record', 'EXIT',],
            }
        ]).then((answer) => {

            switch (answer.options) {
                case 'Add Record':
                    response = addRecord();
                    break;
                case 'View Record':
                    response = viewRecord();
                    break;
                case 'Update Record':
                    response = updateRecord();
                    break;
                case 'Delete Record':
                    response = deleteRecord();
                    break;
                case 'EXIT':
                    response = connection.end();
                    break;
                default:
                    response = ' '
                    break;
            }
        });


};
const addRecord = () => {
    inquirer
        .prompt([
            {
                name: 'addrec',
                type: 'list',
                message: 'What type of record would you like to add?',
                choices: ['Employee Record', 'Role', 'Department']
            },
        ])
        .then((answer) => {
            switch (answer.updaterec) {
                case 'Employee Record':
                    addEmployee();
                    break;

                case 'Role':
                    addRole();
                    break;

                case 'Department':
                    addDepartment();
                    break;

                default:
                    console.log(`Invalid action: ${answer.updaterec}`)

            };
        });

};

const addEmployee = () => {
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
};


const addRole = () => {
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
};

const addDepartment = () => {
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
};

const viewRecord = () => {
    inquirer
        .prompt([
            {
                name: 'searchemp',
                type: 'list',
                message: 'What would you like to view?',
                choices: ['View all employees', 'View all roles', 'View all departments']
            },
        ])
        .then((answer) => {
            let query;
            switch (answer.searchemp) {
                case 'View employees':
                    viewEmployees();
                    break;

                case 'View all roles':
                    query = 'SELECT * FROM roles'
                    break;

                case 'View all departments':
                    query = 'SELECT * FROM department'
                    break;

                default:
                    console.log(`Invalid action: ${answer.searchemp}`)

            }
            console.log(query);
            connection.query(query, async (err, res) => {
                if (err) throw err;
                console.log(res);
                await console.table(res);
                await welcome();
            });
        });
};
const viewEmployees = async () => {
    await inquirer
        .prompt([
            {
                name: 'viewemp',
                type: 'list',
                message: 'How would you like to view employees?',
                choices: ['All employees', 'All by manager', 'All by job title']
            },
        ]).then((answer) => {
            let query;
            switch (answer.viewemp) {
                case 'All employees':
                    query = 'SELECT * FROM employee'
                    break;

                case 'All by manager':
                    query = 'SELECT * FROM employee GROUP BY manager'
                    break;

                case 'All by Job title':
                    query = 'SELECT * FROM employee GROUP BY manager'
                    break;

                default:
                    console.log(`Invalid action: cannot view all employees by that method`);
            };
            console.log(query);
            connection.query(query, async (err, res) => {
                if (err) throw err;
                console.log(res);
                await console.table(res);
                await welcome();
            });
        })
};


const updateRecord = () => {
    inquirer
        .prompt([
            {
                name: 'updaterec',
                type: 'list',
                message: 'What would you like to update?',
                choices: ['Employee Record', 'Roles', 'Department']
            },
        ])
        .then((answer) => {
            switch (answer.updaterec) {
                case 'Employee Record':
                    updateEmployee();
                    break;

                case 'Roles':
                    updateRoles();
                    break;

                case 'Department':
                    updateDepartment();
                    break;

                default:
                    console.log(`Invalid action: ${answer.updaterec}`)

            };
        });

};

const updateEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'firstname',
                type: 'input',
                message: 'What is the first name of the employee you would you like to update?'
            },
            {
                name: 'lastname',
                type: 'input',
                message: 'What is the last name of the employee you would you like to update?'
            },
            {
                name: 'updatefield',
                type: 'list',
                message: 'What field would you like to update?',
                choices: ['first_name', 'last_name', 'job_title', 'manager',],
            },
            {
                name: 'updatedinfo',
                type: 'input',
                message: 'Enter the new information.',
            },
        ])
        .then((answer) => {
            let updatedInfo = answer.updatedinfo;
            let firstName = answer.firstname;
            let lastName = answer.lastname;
            let query;
            switch (answer.updatefield) {
                case 'first_name':
                    query = `UPDATE employee SET first_name = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                    break;

                case 'last_name':
                    query = `UPDATE employee SET last_name = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                    break;

                case 'job_title':
                    query = `UPDATE employee SET job_title = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                    break;

                case 'manager':
                    query = `UPDATE employee SET manager = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                    break;

                default:
                    console.log(`Invalid action: cannot update ${answer.updatefield} by that method`);

            };
            console.log(query);
            console.log(firstName);
            console.log(lastName);
            connection.query(query,
                // [{id: answer.id,}],
                async (err, res) => {
                    if (err) throw err;
                    await console.table(`${res.affectedRows} record updated!\n`);
                    await welcome();
                });
        });
};

const updateRoles = () => {
    connection.query('SELECT * FROM roles', async (err, results) => {
        if (err) throw err;
        await inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'rawlist',
                    message: "Select the role you would like to update.",
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
                    name: 'updatetype',
                    type: 'list',
                    message: 'What would you like to update?',
                    choices: ['title', 'department', 'salary'],
                },
                {
                    name: 'updateinfo',
                    type: 'input',
                    message: 'Enter the new information.',
                },
            ])
            .then((answer) => {
                const query = `UPDATE roles SET ${answer.updatetype} = '${answer.updateinfo}' WHERE ?`
                console.log(query);
                connection.query(query,

                    [
                        {
                            title: answer.role,
                        },
                    ],
                    async (err, res) => {
                        if (err) throw err;
                        await console.table(`${res.affectedRows} record updated!\n`);
                        await welcome();
                    });

            });

    });
};
const updateDepartment = () => {
    connection.query('SELECT * FROM department', async (err, results) => {
        if (err) throw err;
        await inquirer
            .prompt([
                {
                    name: 'department',
                    type: 'rawlist',
                    message: "Select the department you would like to update.",
                    choices() {
                        const deptChoiceArray = [];
                        results.forEach(({ dept_name }) => {
                            deptChoiceArray.push(dept_name);
                        });
                        let uniqueDeptChoice = [...new Set(deptChoiceArray)]
                        return uniqueDeptChoice
                    }
                },
                {
                    name: 'updatetype',
                    type: 'list',
                    message: 'What would you like to update?',
                    choices: ['id', 'dept_name'],
                },
                {
                    name: 'updateinfo',
                    type: 'input',
                    message: 'Enter the new information.',
                },
            ])
            .then((answer) => {
                const query = `UPDATE department SET ${answer.updatetype} = '${answer.updateinfo}' WHERE ?`
                console.log(query);
                connection.query(query,

                    [
                        {
                            dept_name: answer.department,
                        },
                    ],
                    async (err, res) => {
                        if (err) throw err;
                        await console.table(`${res.affectedRows} record updated!\n`);
                        await welcome();
                    });
            });

    });
};

const deleteRecord = () => {
    inquirer
        .prompt([
            {
                name: 'deletetype',
                type: 'list',
                message: 'What would you like to delete?',
                choices: ['Employee record', 'Roles', 'Department',],
            },
            {
                name: 'deletewhat',
                type: 'input',
                message: 'Enter the employee id, role title, or department name you would like to delete.'
            },
        ])
        .then((answer) => {
            let query;
            switch (answer.deletetype) {
                case 'Employee record':
                    query = `DELETE FROM employee WHERE id = ${answer.deletewhat}`
                    break;

                case 'Roles':
                    query = `DELETE FROM roles WHERE title = ${answer.deletewhat}`
                    break;

                case 'Department':
                    query = `DELETE FROM department WHERE dept_name = ${answer.deletewhat}`
                    break;

                default:
                    console.log(`Invalid action: cannot delete ${answer.deletetype} by that method`);

            };
            console.log(query);
            connection.query(query,
                async (err, res) => {
                    if (err) throw err;
                    await console.table(`${res.affectedRows} record deleted!\n`);
                    await welcome();
                });
        });

};



connection.connect((err) => {
    //    time permitting enter graphic
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    const query = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager, roles.title, roles.salary, department.dept_name
    FROM((roles INNER JOIN employee ON roles.title = employee.job_title)
     INNER JOIN department ON roles.department = department.dept_name)`

    connection.query(query, async (err, res) => {
        if (err) throw err;
        await console.table(res);
        await welcome();
    });

});
