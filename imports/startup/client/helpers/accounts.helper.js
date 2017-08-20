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
	console.log("[ACCOUNTS-HELPER] login template created");
	Meteor.call('users.isEmpty', null, function(err, result) {
		if (!result) {
			$("#at-signUp").remove();
		}
	});
})

Template.login.events({
	'click .at-btn' (event) {
		$(event.target).addClass('loading');
	}
});

/*
[BLAZE TEMPLATE] Profile (located @main.html)
*/
// Template.profile.events({
//  'click .logout-btn' (event) {
// 	AccountsTemplates.logout();
	
//   }
// })

