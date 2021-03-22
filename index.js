const mysql = require('mysql');
const inquirer = require('inquirer');
const console_table = require('console.table');


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
    //    time permitting enter graphic
    inquirer
        .prompt({
            name: 'options',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['Add Employee', 'Add Role', 'Add Department', 'View Employee',
                'View Roles', 'View Departments', 'Update Employee', 'Delete Record', 'EXIT',],
        })
        .then((answer) => {
            // based on their answer, either call the bid or the post functions
            switch (answer) {
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
                    response = updateEmployee();
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

/*add employee
addRole
addDepartment
viewEmployee(all or group by manager)
viewRoles(all)
viewDepartments (all)
updateEmployee (role and manager)
deleteRecord (delete employee, delete role, delete department by name)
display inner joined tables using console.table*/

const addEmployee = () =>{
    inquirer
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
        choices(){
            const roleChoiceArray = [];
            answers.forEach(({roles_title})=>{
                roleChoiceArray.push(roles_title);
            });
            return roleChoiceArray
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
        choices(){
            const deptChoiceArray = [];
            answers.forEach(({dept_name})=>{
                deptChoiceArray.push(dept_name);
            });
            return deptChoiceArray
             }
        },
    ])
    .then((answer) => {
        // based on their answer, either call the bid or the post functions
       connection.query(
           'INSERT INTO employee SET?',
           {
            first_name: answer.emp_firstname,
            last_name: answer.emp_firstname,
            job_title: answer.emp_role,
            manager: answer.emp_manager,
            
          },
          (err, res) => {
            if (err) throw err;
            console.log("Employee successfully added.")
          })
    });

};


const addRole = () => {
    inquirer
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
                choices(){
                    const deptChoiceArray = [];
                    answers.forEach(({dept_name})=>{
                        deptChoiceArray.push(dept_name);
                    });
                    return deptChoiceArray
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
               (err, res) => {
                 if (err) throw err;
                 console.log("Department successfully created.")
               })
        })
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
        switch (answer.searchemp){
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
const allEmployees = () =>{ 
    connection.query('SELECT * FROM employee', (err, res) => {
             if (err) throw err;
            // post res using console.table 
           })
    };

const employeesByManager = () => {
    const query =
    'SELECT * FROM employee GROUP BY manager';
  connection.query(query, (err, res) => {
    if (err) throw err;
    //  post employee using console.table);
    welcome();
  });
};

const viewRoles = () => {
    connection.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
       // post res using console.table 
      })
};

const viewDepartments = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
       // post res using console.table 
      })
};

const updateEmployee = () => {};

const deleteRecord = () => {};