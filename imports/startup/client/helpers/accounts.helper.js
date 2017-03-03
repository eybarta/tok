Template.account.helpers({
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

Template.account.events({
 'click .logout-btn' (event) {
	Meteor.logout(function(res) {
		console.log('log out callback >> ', res)
	});
  }
})