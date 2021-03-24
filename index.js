const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const ascii = require('ascii-art');


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

const welcome = ()  => {
    //    time permitting enter graphic
    
  inquirer
        .prompt([
            {
            name: 'options',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: ['Add Employee', 'Add Role', 'Add Department', 'View Employee',
                'View Roles', 'View Departments', 'Update Employee', 'Update Roles', 'Update Department', 'Delete Record', 'EXIT',],
        }
      ]).then((answer) => {
           
            switch (answer.options) {
                case 'Add Employee':
                    response = addEmployee();
                    break;
                case 'Add Role':
                    response = addRole();
                    break;
                case 'Add Department':
                    response = addDepartment();
                    break;
                case 'View Employee':
                    response = search();
                    break;
                case 'View Roles':
                    response = search();
                    break;
                case 'View Departments':
                    response = search();
                    break;
                case 'Update Employee':
                    response = updateRecord();
                    break;
                case 'Update Roles':
                    response = updateRecord();
                    break;
                case 'Update Department':
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

const addEmployee = () => {
    connection.query ( 'SELECT * FROM department, roles', async (err, results) =>{
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
    connection.query ( 'SELECT * FROM department', async (err, results) =>{
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

const search = () => {
    inquirer
        .prompt([
            {
                name: 'searchemp',
                type: 'list',
                message: 'What would you like to view?',
                choices: ['View all employees', 'View employees by manager', 'View all roles', 'View all departments']
            },
        ])
        .then((answer) => {
            switch (answer.searchemp) {
                case 'View all employees':
                    allEmployees();
                    break;

                case 'View employees by manager':
                    employeesByManager();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all departments':
                    viewDepartments();
                    break;

                default:
                    console.log(`Invalid action: ${answer.searchemp}`)

            }
        })


};
const allEmployees = () => {
    connection.query('SELECT * FROM employee', async (err, res) => {
       if (err) throw err;
       console.log(res);
       await console.table(res);
       await welcome();
    })
   
};

const employeesByManager = () => {
    const query =
        'SELECT * FROM employee GROUP BY manager';
    connection.query(query, async (err, res) => {
        if (err) throw err;
        await console.table(res)
        await welcome();
    });
    
};

const viewRoles = () => {
    connection.query('SELECT * FROM roles', async (err, res) => {
        if (err) throw err;
        await console.table(res);
        await welcome();
    });
   
};

const viewDepartments = () => {
    connection.query('SELECT * FROM department', async (err, res) => {
        if (err) throw err;
       await console.table(res);
       await welcome();
    })
    
};
const updateRecord = ()  => {
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
                name: 'id',
                type: 'input',
                message: 'What is the id number of the employee you would you like to update?'
            },
            {
                name: 'updatefield',
                type: 'list',
                message: 'What would you like to update?',
                choices: ['first_name','last_name','job_title','manager',],
            },
            {
                name: 'updateinfo',
                type: 'input',
                message: 'Enter the new information.',
            },
        ])
        .then((answer) => {
            let updatefield = answer.updatefield;
             let updateinfo = answer.updateinfo;
            const query = `UPDATE employee SET ${updatefield} =  ${updateinfo} WHERE ?`
            connection.query(query,
                [{id: answer.id,}],
                 async (err, res) => {
                    if (err) throw err;
                    await console.table(`${res.affectedRows} record updated!\n`);
                    await welcome();
                });
        });
};

const updateRoles = () => {
    connection.query ( 'SELECT * FROM roles', async (err, results) =>{
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
            const query = `UPDATE roles SET ${answer.updatetype} = ${answer.updateinfo} WHERE ?`
            //  first_name = ${answer.firstname} last_name = ${answer.lastname}
            connection.query(query,

                [
                    {
                        role: answer.role,
                    },
                ],
                (err, res) => {
                    if (err) throw err;
                    console.table(`${res.affectedRows} record updated!\n`);
                });
        });
        await welcome()
    });
};
const updateDepartment = () => {
    connection.query ( 'SELECT * FROM department', async (err, results) =>{
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
            const query = `UPDATE department SET ${answer.updatetype} = ${answer.updateinfo} WHERE ?`
            //  first_name = ${answer.firstname} last_name = ${answer.lastname}
            connection.query(query,

                [
                    {
                        dept_name: answer.department,
                    },
                ],
                (err, res) => {
                    if (err) throw err;
                    console.table(`${res.affectedRows} record updated!\n`);
                });
        });
        await welcome();
    });
};

const deleteRecord = () => {
    inquirer
        .prompt([
            {
                name: 'deletetype',
                type: 'list',
                message: 'What would you like to delete?',
                choices: ['Employee', 'roles', 'Department',],
            },
            {
                name: 'deletewhere',
                type: 'list',
                message: 'Select how you would like to identify the record to delete. Delete Employee records by [id], roles by [title], or departments by [dept_name]?',
                choices: ['id', 'title', 'dept_name',],
            },
            {
                name: 'deletewhat',
                type: 'input',
                message: 'Enter the information you would like to delete.'
            },
        ])
        .then((answer) => {
            switch (answer.deletetype) {
                case 'Employee':
                    response `DELETE FROM employee Where${answer.deletewhere}=${answer.deletewhat}`
                    break;

                case 'Roles':
                    response `DELETE FROM roles Where${answer.deletewhere}=${answer.deletewhat}`
                    break;

                case 'Department':
                    response `DELETE FROM department Where${answer.deletewhere}=${answer.deletewhat}`
                    break;

                default:
                    console.log(`Invalid action: cannot delete ${answer.deletetype} by ${answer.deletewhere}`);

                    return response

            };
            console.log(response);
            const query = response;
            connection.query(query,
              async  (err, res) => {
                    if (err) throw err;
                   await console.table(`${res.affectedRows} record deleted!\n`);
                   await welcome();
                });
        });
    
};



connection.connect((err)  => {
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