const cTable = require('console.table');
const connection = require('./connection');
const inquirer = require('inquirer');


connection.query(query, async (err, res) => {
        if (err) throw err;
        await console.table(res);
        welcome();
    });

const displayAll = () =>{
    connection.connect((err) => {
        if (err) throw err;
        console.log(`connected as id ${connection.threadId}\n`);
        const query = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager, roles.title, roles.salary, department.dept_name
        FROM((roles INNER JOIN employee ON roles.title = employee.job_title)
         INNER JOIN department ON roles.department = department.dept_name)`
        });
}

const welcome = () => {
    inquirer
        .prompt([
            {
                name: 'options',
                type: 'rawlist',
                message: 'What would you like to do?',
                choices: ['Add Record', 'View Records', 'Update Record', 'Delete Record', 'EXIT',],
            }
        ]).then((answer) => {

            switch (answer.options) {
                case 'Add Record':
                    response = addRecord();
                    break;
                case 'View Records':
                    response = viewRecords();
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
            switch (answer.addrec) {
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
                    console.log(`Invalid action: ${answer.addrec}`)

            };
        });

};
const addEmployee = async () => {
    try {
        connection.query('SELECT * FROM department, roles', async (err, results) => {
            if (err) throw err;
            const getChoice = await inquirer
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
            console.log(getChoice)
            const firstName = getChoice.emp_firstname;
            const lastName = getChoice.emp_lastname;
            const jobTitle = getChoice.emp_role;
            const manager = getChoice.emp_manager;
            await connection.query('INSERT INTO employee SET?',
                [{
                    first_name: firstName,
                    last_name: lastName,
                    job_title: jobTitle,
                    manager: manager,

                }],
                (err, res) => {
                    if (err) throw err;
                    console.log("Employee successfully added.")

                });
           
            welcome()
        });

    } catch (error) { console.log(error) };

};


const addRole = async () => {
    try {
        connection.query('SELECT * FROM department', async (err, results) => {
            if (err) throw err;
            const getChoice = await inquirer
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
            console.log(getChoice)
            const role = getChoice.role_name;
            const salary = getChoice.role_salary
            const department = getChoice.role_department;
            await connection.query(
                'INSERT INTO roles SET?',
                [{
                    title: role,
                    salary: salary,
                    department: department,
                }],
                (err, res) => {
                    if (err) throw err;
                    await console.log("Role successfully created.")

                })
            
            welcome()
        });


    } catch (error) { console.log(error) }

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
                    dept_name: answer.dept_name,
                },

                async (err, res) => {
                    if (err) throw err;
                    await console.log("Department successfully created.")
                    
                    welcome();
                })

        });
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
const updateEmployee = async () => {
    try {
        const getChoice = await inquirer
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
        console.log(getChoice)
        let updateField = getChoice.updatefield;
        let updatedInfo = getChoice.updatedinfo;
        let firstName = getChoice.firstname;
        let lastName = getChoice.lastname;
        let query;
        switch (updateField) {
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
                console.log(`Invalid action: cannot update ${updateField} by that method`);

        };
        console.log(query);
        console.log(firstName);
        console.log(lastName);
        connection.query(query, async (err, res) => {
            if (err) throw err;
            await console.table(`${res.affectedRows} record updated!\n`);
            
            welcome();
        });
    } catch (error) { console.log(error) };
};

const updateRoles = async () => {
    try {
        connection.query('SELECT * FROM roles', async (err, results) => {
            if (err) throw err;
            const getChoice = await inquirer
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
            console.log(getChoice)
            const updateType = getChoice.updatetype;
            const updateInfo = getChoice.updateinfo;
            const role = getChoice.role;
            const query = `UPDATE roles SET ${updateType} = '${updateInfo}' WHERE ?`
            console.log(query);
            connection.query(query, [{ title: role }], async (err, res) => {
                if (err) throw err;
                await console.table(`${res.affectedRows} record updated!\n`);
                
                welcome();
            });

        });
    } catch (error) { console.log(error) };
};
const updateDepartment = async () => {
    try {
        connection.query('SELECT * FROM department', async (err, results) => {
            if (err) throw err;
            const getChoice = await inquirer
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
            console.log(getChoice)
            const updateType = getChoice.updatetype;
            const updateInfo = getChoice.updateinfo;
            const department = getChoice.department;
            const query = `UPDATE department SET ${updateType} = '${updateInfo}' WHERE ?`
            console.log(query);
            connection.query(query, [{ dept_name: department }], async (err, res) => {
                if (err) throw err;
                await console.table(`${res.affectedRows} record updated!\n`);
               
                welcome();
            });
        });
    } catch (error) { console.log(error) }
};
const viewRecords = () => {
    inquirer
        .prompt([
            {
                name: 'viewrec',
                type: 'list',
                message: 'What would you like to view?',
                choices: ['Employee Record', 'Roles', 'Departments']
            },
        ])
        .then((answer) => {
            switch (answer.viewrec) {
                case 'Employee Record':
                    viewEmployees();
                    break;

                case 'Roles':
                    viewRoles();
                    break;

                case 'Departments':
                    viewDepartments();
                    break;

                default:
                    console.log(`Invalid action: ${answer.viewrec}`)

            };
        });

};
const viewRoles = async () => {
    try {
        const roles = await connection.query('SELECT * FROM roles', (err, res) => {
            if (err) throw err;
            console.table(res);
            welcome()
        })
    } catch (error) {
        console.log(err)
    }

};

const viewDepartments = async () => {

    try {
        const roles = await connection.query('SELECT * FROM department', (err, res) => {
            if (err) throw err;
            console.table(res);
            
            welcome()
        })
    } catch (error) {
        console.log(err)
    }

};

const viewEmployees = async () => {
    console.log("we called viewEmployees")
    try {
        const getChoice = await inquirer
            .prompt([
                {
                    name: 'viewemp',
                    type: 'list',
                    message: 'How would you like to view employees?',
                    choices: ['All employees', 'All by manager', 'All by job title'],
                },
            ])
        console.log(getChoice);
        console.log(getChoice.viewemp);
        const viewemp = getChoice.viewemp;
        console.log("view emp line 50:", viewemp);
        let query;
        switch (viewemp) {
            case 'All employees':
                console.log("all employees case")
                query = 'SELECT * FROM employee'
                break;

            case 'All by manager':
                console.log("by manager case")
                query = 'SELECT * FROM employee GROUP BY manager'
                break;

            case 'All by Job title':
                console.log("by job title case")
                query = 'SELECT * FROM employee GROUP BY manager'
                break;

            default:
                console.log(`Invalid action: cannot view all employees by that method`);
        }
        connection.query(query, async (err, res) => {
            if (err) throw err;
            await console.table(res);
            welcome();
        });
    } catch (error) {
        console.log(error)
    }

};

const deleteRecord = async () => {
    try {
        const getChoice = await inquirer
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
        console.log("delete choice:", getChoice);
        const deleteWhat = getChoice.deletewhat;
        const deleteType = getChoice.deletetype;
        let query;
        switch (deleteType) {
            case 'Employee record':
                query = `DELETE FROM employee WHERE id = ${deleteWhat}`
                break;

            case 'Roles':
                query = `DELETE FROM roles WHERE title = ${deleteWhat}`
                break;

            case 'Department':
                query = `DELETE FROM department WHERE dept_name = ${deleteWhat}`
                break;

            default:
                console.log(`Invalid action: cannot delete ${deleteType} by that method`);

        };
        console.log(query);
        connection.query(query,
            async (err, res) => {
                if (err) throw err;
                await console.table(`${res.affectedRows} record deleted!\n`);
                 welcome();
            });
    } catch (error) {
        console.log(error)
    }

};


