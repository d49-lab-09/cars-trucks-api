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
      if (continueCrud.continue === 'no') { return await afterLogin(userData, rolePermissions); }


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
        await getVehicle(userData, category);
        return await afterLogin(userData, rolePermissions);
      } else {
        break;
      }
    }

  } catch (e) {
    console.log(e);
  }
}



async function getVehicle(userData, category) {
  const { token } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const data = await axios.get(`http://localhost:3001/${category}s`, config);
  console.log(data.data);
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
  console.log(data.data);
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
  console.log(data.data);
  adminUser(userData);
}

async function getOneUser(userData) {
  const { token } = userData;
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const data = await axios.get('http://localhost:3001/users', config);
  const userIds = data.data.map(users => ({
    [users.username]: users.id,
  }));
  console.log('Enter "exit" to go back to main menu');
  const userToFind = await inquirer
    .prompt([{
      type: 'input',
      name: 'user',
      message: 'Enter username to search.',
    }]);

  if (userToFind.user.toLocaleLowerCase() === 'exit') return await afterLogin(userData, admin);

  const foundUser = userIds.filter(user => {
    return Object.keys(user)[0].toLocaleLowerCase() === userToFind.user.toLocaleLowerCase();
  });
  if (!foundUser.length) {
    console.log(`${userToFind.user} not found!`);
    return await getOneUser(userData);
  }
  const [id] = Object.values(foundUser[0]);

  const gotOne = await axios.get(`http://localhost:3001/users/${id}`, config);
  console.log();
  console.log();
  console.log(gotOne.data);
  console.log();
  return await afterLogin(userData, admin);
}
async function deleteUser(userData) {
  const { token } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const data = await axios.get('http://localhost:3001/users', config);
  const userNames = data.data.map(users => users.username);
  const userIds = data.data.map(users => ({
    [users.username]: users.id,
  }));

  userNames.push('Exit');
  const userToDelete = await inquirer
    .prompt([{
      type: 'list',
      name: 'user',
      message: 'Please choose an user to delete.',
      choices: userNames,
    }]);

  if (userToDelete.user === 'Exit') return await afterLogin(userData, admin);
  const foundUser = userIds.filter(user => {
    return Object.keys(user)[0] === userToDelete.user;
  });
  const [id] = Object.values(foundUser[0]);

  const confirm = await inquirer
    .prompt([{
      type: 'list',
      name: 'confirm',
      message: `Are you sure you want to delete ${userToDelete.user}?`,
      choices: ['no', 'yes'],
    }]);

  if (confirm.confirm === 'no') return await deleteUser(userData);

  const status = await axios.delete(`http://localhost:3001/users/${id}`, config);
  console.log();
  console.log();
  console.log(status.data.status);
  console.log();
  console.log(userToDelete.user, 'has been successfully updated');
  console.log();
  console.log();
  return await afterLogin(userData, admin);
}
async function updateUser(userData) {

  const { token } = userData;

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const data = await axios.get('http://localhost:3001/users', config);
  const userNames = data.data.map(users => users.username);
  const userIds = data.data.map(users => ({
    [users.username]: users.id,
  }));

  userNames.push('Exit');
  const userToUpdate = await inquirer
    .prompt([{
      type: 'list',
      name: 'user',
      message: 'Please choose an option.',
      choices: userNames,
    }]);

  if (userToUpdate.user === 'Exit') return await afterLogin(userData, admin);
  const foundUser = userIds.filter(user => {
    return Object.keys(user)[0] === userToUpdate.user;

  });
  const [id] = Object.values(foundUser[0]);

  const body = await inquirer
    .prompt([{
      type: 'input',
      name: 'username',
      message: `What will ${userToUpdate.user}'s name be?`,
    },
    {
      type: 'list',
      name: 'role',
      message: `What will ${userToUpdate.user}'s role be?`,
      choices: ['user', 'admin'],
    },
    {
      type: 'list',
      name: 'vehicleType',
      message: `What will ${userToUpdate.user}'s vehicle type be?`,
      choices: ['car', 'truck', 'both'],
    },
    ]);

  const updatedUser = await axios.put(`http://localhost:3001/users/${id}`, body, config);
  console.log();
  console.log();
  console.log(updatedUser);
  console.log();
  console.log(updatedUser.data.username, 'has been successfully updated');
  console.log();
  console.log();
  return await afterLogin(userData, admin);
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
  } else if (userQs.users === 'Get One User') {
    await getOneUser(userData);
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

