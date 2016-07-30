import React from 'react';
import {mount} from 'react-mounter';

import {HomeView} from '../imports/views/Home';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        mount(HomeView);
    }
});

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');