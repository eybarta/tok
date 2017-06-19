import { router } from '/imports/startup/client/router'
Meteor.call('users.isEmpty', null, function(err, result) {
  if (!result) {
    $("#at-signUp").remove();
  }
});

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
function hideRegisterLink() {
  AccountsTemplates.configure({
    hideSignUpLink: true
  })
}

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
const userId = Meteor.userId()
// CALLBACKS
Accounts.onLogin(() => {
  console.log('login callback');
  let interval = Meteor.setInterval(function() {
      let userId = Meteor.userId()
      console.log('useriddd ', userId);
      
      if (!!userId) {
        Meteor.clearInterval(interval)
        console.log('finally logged in >> ', router, );
        if (router.currentRoute.path=="/") {
          router.push({ name: 'adminhome'})
        }
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