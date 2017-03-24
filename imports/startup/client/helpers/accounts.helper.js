

Template.login.helpers({
	currentUser() {
		return Meteor.user()
	},
	unsigned() {
		return Accounts.userId()==null;
	},
	signed() {
		return Accounts.userId()!=null;
	},
	username() {
		let user = Accounts.user() && Accounts.user().profile ?  Accounts.user().profile.name : null;
		return user;
	}
});

Template.profile.events({
 'click .logout-btn' (event) {
	AccountsTemplates.logout();
	
  }
})