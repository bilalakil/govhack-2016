import React from 'react';
import {mount} from 'react-mounter';

import HomeView from '../imports/views/Home';
import Leaderboard from '../imports/views/Leaderboard';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        mount(HomeView);
    }
});

FlowRouter.route('/leaderboard', {
    name: 'leaderboard',
    action: function() {
        mount(Leaderboard);
    }
});

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');