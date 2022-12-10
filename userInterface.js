'use strict';
const axios = require('axios');
const inquirer = require('inquirer');


const admin = ['create', 'read', 'read all', 'update', 'delete', 'exit'];
const user = ['read', 'read all', 'exit'];




async function crudStuff(rolePermissions, userData, carsOrTrucks = '') {
  let category = userData.vehicleType;
  if (userData.role === 'admin') {
    category = carsOrTrucks;
  } else {
    console.log();
    console.log();
    console.log(`${category.toUpperCase()} MENU`);
  }
  const inquirerRunning = true;
  try {
    while (inquirerRunning) {

      const continueCrud = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'continue',
            message: `Would you like to interface with ${category}s?`,
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
        getVehicle(userData);
      } else {
        break;
      }
    }

  } catch (e) {
    console.log(e);
  }
}



async function getVehicle(userData) {
  let { token, vehicleType } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const data = await axios.get(`http://localhost:3001/${vehicleType}s`, config);
  console.log(data);
}


async function getCars(userData) {
  const { token } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const data = await axios.get('http://localhost:3001/cars', config);
  console.log(data);
}

async function getTrucks(userData) {
  const { token } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

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

async function performSignup(loginData) {
  const url = 'http://localhost:3001/signup';
  const data = await axios.post(url, {
    username: loginData.username,
    password: loginData.password,
    vehicleType: loginData.vehicleType.toLowerCase(),
  });
  console.log(data);
  return data;
}

async function afterLogin(userData, rolePermissions) {
  if (userData.role === 'admin') {
    console.log('ADMIN MENU');
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
      adminUser(userData);
    } else if (nextStepsAdmin.choice === 'Access Truck Data') {
      await crudStuff(rolePermissions, userData, 'truck');
    } else if (nextStepsAdmin.choice === 'Access Car Data') {
      await crudStuff(rolePermissions, userData, 'car');
    }
  } else {
    await crudStuff(rolePermissions, userData);
  }
}

async function getUsers(userData) {
  const { token } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const data = await axios.get('http://localhost:3001/users', config);
  console.log(data);
  adminUser(userData);
}

async function getOneUser(userData) {
  console.log('axios will get one users');
}

async function deleteUser(userData) {
  console.log('axios will delete users');
}

async function updateUser(userData) {
  console.log('axios will update users');
}



async function adminUser(userData) {
  const userQs = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'users',
        message: 'Please choose an option.',
        choices: ['Get Users', 'Delete User', 'Update User', 'Get One User', 'Exit'],
      },
    ]);

  if (userQs.users === 'Exit') {
    return;
  } else if (userQs.users === 'Get Users') {
    getUsers(userData);
  } else if (userQs.users === 'Delete User') {
    deleteUser(userData);
  } else if (userQs.users === 'Update User') {
    updateUser(userData);
  } else if (userQs.users === 'Search One User') {
    getOneUser(userData);
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

    const userDataResponse = await performLogin(loginData);

    const userData = {
      vehicleType: userDataResponse.data.vehicleType,
      role: userDataResponse.data.role,
      token: userDataResponse.data.token,
    };
    let rolePermissions;
    if (userData.role === 'admin') {
      rolePermissions = admin;
    } else if (userData.role === 'user') {
      rolePermissions = user;
    }

    await afterLogin(userData, rolePermissions);


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
          message: 'What is your password?',
        },
        {
          type: 'list',
          name: 'vehicleType',
          message: 'choose your favorite vehicle type.',
          choices: ['Car', 'Truck'],
        },
      ]);

    const userDataResponse = await performSignup(loginData);

    const userData = {
      vehicleType: userDataResponse.data.vehicleType,
      role: userDataResponse.data.role,
      token: userDataResponse.data.token,
    };
    let rolePermissions;
    if (userData.role === 'admin') {
      rolePermissions = admin;
    } else if (userData.role === 'user') {
      rolePermissions = user;
    }
    await crudStuff(rolePermissions, userData);
  }

}

startScript();

