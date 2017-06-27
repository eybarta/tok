/*
[BLAZE TEMPLATE] Login (located @main.html)
*/
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
	
});
Template.login.onCreated(function() {
	console.log("PROFILE TEMPLATE CREATED");
	Meteor.call('users.isEmpty', null, function(err, result) {
			if (!result) {
				$("#at-signUp").remove();
			}
		});

	

})


/*
[BLAZE TEMPLATE] Profile (located @main.html)
*/
// Template.profile.events({
//  'click .logout-btn' (event) {
// 	AccountsTemplates.logout();
	
//   }
// })

