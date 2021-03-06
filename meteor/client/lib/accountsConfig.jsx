import React from 'react';

import LoginView from '../imports/views/Login';

AccountsTemplates.configure({
    defaultLayoutType: 'blaze-to-react',
    defaultLayout: LoginView,
    defaultContentRegion: 'content',
    showForgotPasswordLink: true,
    overrideLoginErrors: true,
    enablePasswordChange: true,
    focusFirstInput: false,
    showLabels: true,
    showPlaceholders: false,
    showValidating: true,
    negativeValidation: true,
    positiveValidation: true,
    negativeFeedback: false,
    positiveFeedback: true,
    texts: {
        errors: {
            loginForbidden: "Login failed. Check your username/email and password.",
            mustBeLoggedIn: "Sign in or register",
            pwdMismatch: "Passwords don't match"
        }
    }
});

if (Meteor.isClient && navigator.userAgent.match('CriOS')) {
    // Fix for Chrome iOS bug where FB login doesn't work
    AccountsTemplates.configure({socialLoginStyle: 'redirect'});
}

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
    {
        _id: "username",
        type: "text",
        displayName: "username",
        required: true,
        minLength: 5
    },
    {
        _id: 'email',
        type: 'email',
        required: true,
        displayName: "email",
        re: /.+@(.+){2,}\.(.+){2,}/,
        errStr: 'Invalid email'
    },
    {
        _id: 'username_and_email',
        type: 'text',
        required: true,
        displayName: "Username or email"
    },
    pwd
]);