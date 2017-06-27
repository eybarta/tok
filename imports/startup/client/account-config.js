import { router } from '/imports/startup/client/router'


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

AccountsTemplates.configure({
  texts: {
    button: {
        signIn: 'התחבר',
        signUp: 'הירשם'
    },
    signUpLink_pre: '',
    signUpLink_link: 'צריך להירשם?',
    signInLink_pre: 'כבר רשום?',
    signInLink_link: 'התחבר',

  },
})

AccountsTemplates.addFields([
    {
        _id: 'name',
        type: 'text',
        displayName: "שם מלא",
        required: false,
    },
    {
      _id: "username",
      type: "text",
      displayName: "שם משתמש",
      required: true,
      minLength: 5,
    },
    {
      _id: 'email',
      type: 'email',
      required: false,
      displayName: "אימייל",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
    pwd
]);

// AccountsTemplates.addField(email);
// AccountsTemplates.addField(pwd);
const userId = Meteor.userId()
// CALLBACKS
Accounts.onLogin(() => {
  console.log('login callback');
  let interval = Meteor.setInterval(function() {
      let userId = Meteor.userId()
      console.log('useriddd ', userId);
      
      if (!!userId) {
        Meteor.clearInterval(interval)
        router.push({ name: 'home'})
      }
      
    }, 100)

})

Accounts.onLogout(() => {
    console.log('logout callback');
    let interval = Meteor.setInterval(function() {
      let userId = Meteor.userId()
      console.log('useriddd ', userId);
      
      if (!userId) {
        console.log('finally logged out');
        clearInterval(interval)
        router.push('/')
      }
      
    }, 100)

})