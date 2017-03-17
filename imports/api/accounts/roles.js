const checkIfFirstUser = () => {
  const userCount = Meteor.users.find().count();
  return userCount === 0;
};

const assignRoles = (options, user) => {
  const firstUser = checkIfFirstUser();
  if (firstUser) {
    const roles = ['admin'];
    user.roles = roles;
    Roles.addUsersToRoles(user._id, roles);
  } else {
    const roles = ['user'];
    user.roles = roles;
    Roles.addUsersToRoles(user._id, roles);
  }
  return user;
};

Accounts.onCreateUser((options, user) => {
  console.log('on create user >> ', options, user);
  if (options.profile) {
    user.profile = options.profile;
  }
  assignRoles(options, user);
  return user;
});