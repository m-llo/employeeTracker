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
      updateEmployee: () => {
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
                    async (err, res) => {
                        if (err) throw err;
                        await console.table(`${res.affectedRows} record updated!\n`);
                        await welcome();
                    });
            });
    },

    updateRoles: () => {
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
    },
    updateDepartment: () => {
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
    }
}