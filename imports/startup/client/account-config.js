var email = AccountsTemplates.removeField('email');
var pwd = AccountsTemplates.removeField('password');



AccountsTemplates.addFields([
    {
        _id: 'name',
        type: 'text',
        displayName: "Name",
        required: true,
    }
]);

AccountsTemplates.addField(email);
AccountsTemplates.addField(pwd);