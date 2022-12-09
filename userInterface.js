'use strict';
const axios = require('axios');
const inquirer = require('inquirer');
const base64 = require('base-64');


const admin = ['create', 'read', 'read all', 'update', 'delete', 'exit'];
const user = ['read', 'read all', 'exit'];




async function crudStuff(rolePermissions) {

  try {
    while (true) {

      const continueCrud = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'continue',
            message: 'Would you like to perform a CRUD function?',
            choices: ['yes', 'no'],
          },
        ]);
      if (continueCrud.continue === 'no') { break; }


      const pickCrud = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'pickCrud',
            message: 'Which operation would you like to conduct?',
            choices: rolePermissions,
          },
        ]);

      if (pickCrud.pickCrud === 'create') {
        console.log('you chose create');
      } else if (pickCrud.pickCrud === 'read') {
        console.log('you chose read');
      } else if (pickCrud.pickCrud === 'update') {
        console.log('you chose read');
      } else if (pickCrud.pickCrud === 'delete') {
        console.log('you chose delete');
      } else if (pickCrud.pickCrud === 'read all') {
        console.log('you chose read all');
      } else {
        break;
      }
    }

  } catch (e) {
    console.log(e);
  }
}






async function getCars(config) {
  const data = await axios.get('http://localhost:3001/cars', config);
  console.log(data);
}

async function getTrucks(config) {
  const data = await axios.get('http://localhost:3001/trucks', config);
  console.log(data);
}


async function performLogin(loginData) {
  const url = 'http://localhost:3001/signin';
  const data = await axios.post(url, {}, {
    auth: {
      username: loginData.username,
      password: loginData.password,
    },
  });
  return data;
}

function performSignup(loginData) {
  console.log(loginData);
}

async function afterLogin(role) {
  if (role === 'admin') {
    const nextStepsAdmin = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'Please choose an option.',
          choices: ['Access User Data', 'Access Truck Data', 'Access Car Data', 'Exit'],
        },
      ]);
    if (nextStepsAdmin.choice === 'Exit') {
      return;
    } else if (nextStepsAdmin.choice === 'Access User Data') {
      adminUser();
    } else if (nextStepsAdmin.choice === 'Access Truck Data') {
      getTrucks();
    } else if (nextStepsAdmin.choice === 'Access Car Data') {
      getCars();
    }

  } else {
    await crudStuff(rolePermissions);
  }
}

function getUsers() {
  console.log('axios will get all users');
}

function getOneUser() {
  console.log('axios will get all users');
}

function deleteUser() {
  console.log('axios will delete users');
}

function updateUser() {
  console.log('axios will update users');
}



async function adminUser() {
  const userQs = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'users',
        message: 'Please choose an option.',
        choices: ['Get Users', 'Delete User', 'Update User', 'Search One User', 'Exit'],
      },
    ]);

  if (userQs.users === 'Exit') {
    return;
  } else if (userQs.users === 'Get Users') {
    getUsers();
  } else if (userQs.users === 'Delete User') {
    deleteUser();
  } else if (userQs.users === 'Update User') {
    updateUser();
  } else if (userQs.users === 'Search One User') {
    getOneUser();
  }
}

async function startScript() {
  const loginQuestion = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'start',
        message: 'Please choose an option.',
        choices: ['Login', 'Signup', 'Exit'],
      },
    ]);
  if (loginQuestion.start === 'exit') {
    return;
  } else if (loginQuestion.start === 'Login') {
    const loginData = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'username',
          message: 'What is your username?',
        },
        {
          type: 'password',
          name: 'password',
          message: 'What is your password?',
        },
      ]);

    const userData = await performLogin(loginData);
    let role = userData.data.role;
    let token = userData.data.token;
    console.log(role, token);
    let rolePermissions;
    if (role === 'admin') {
      rolePermissions = admin;
    } else if (role === 'user') {
      rolePermissions = user;
    }


    await afterLogin(role);
    await crudStuff(rolePermissions);

  } else if (loginQuestion.start === 'Signup') {
    const loginData = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Please choose your username?',
        },
        {
          type: 'password',
          name: 'password',
          message: 'What is your username?',
        },
        {
          type: 'list',
          name: 'vehicleType',
          message: 'choose your favorite vehicle type.',
          choices: ['Car', 'Truck'],
        },
      ]);
    await performSignup(loginData);
    await crudStuff(rolePermissions);
  }

}

startScript();

// const config = {
//   headers: { Authorization: `Bearer ${token}` }
// };

// const bodyParameters = {
//  key: "value"
// };

// Axios.post( 
// 'http://localhost:8000/api/v1/get_token_payloads',
// bodyParameters,
// config
// ).then(console.log).catch(console.log);