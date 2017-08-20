import { router } from '/imports/startup/client/router'

T9n.map('en', {
  error: {
    accounts: {
      'Login forbidden': 'שם או סיסמא לא נכונים. נסו שוב.'
    }
  }
});

var email = AccountsTemplates.removeField('email');
var pwd = AccountsTemplates.removeField('password');

Accounts.config({ 
//   forbidClientAccountCreation: true, 
  // loginExpirationDays: 0.5
}); 

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

AccountsTemplates.configure({
  texts: {
    title: {
      signIn: "כניסה למערכת"
    },
    button: {
        signIn: 'התחבר',
        signUp: 'הירשם'
    },
    signUpLink_pre: '',
    signUpLink_link: 'צריך להירשם?',
    signInLink_pre: 'כבר רשום?',
    signInLink_link: 'התחבר',
    errors: {
      loginForbidden: "error.accounts.myDescriptiveError"
    }
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


const userId = Meteor.userId()
Meteor.loggingIn(function(a,b,c) {
  console.log('logging in...',a,b,c);

})
// CALLBACKS
Accounts.onLoginFailure(function(a,b,c) {
  $('.at-btn').removeClass('loading');
  
})
Accounts.onLogin(function() {
  if (!userId) {
    router.push({ name: 'home', params: ''})
  }
})

Accounts.onLogout(() => {
    let interval = Meteor.setInterval(function() {
      let userId = Meteor.userId()
      if (!userId) {
        router.push('/logout')
        clearInterval(interval)
      }
    }, 100)
})