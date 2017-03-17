// import { Accounts } from 'meteor/accounts-base';

var email = AccountsTemplates.removeField('email');
var pwd = AccountsTemplates.removeField('password');

Accounts.config({ 
//   forbidClientAccountCreation: true, 
//   loginExpirationDays: 30, 
}); 
// Accounts.ui.config({ 
//   passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL', 
// }); 

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

AccountsTemplates.addFields([
    {
        _id: 'name',
        type: 'text',
        displayName: "Name",
        required: false,
    },
    {
      _id: "username",
      type: "text",
      displayName: "Username",
      required: true,
      minLength: 9,
    },
    {
      _id: 'email',
      type: 'email',
      required: false,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
    pwd
]);

// AccountsTemplates.addField(email);
// AccountsTemplates.addField(pwd);