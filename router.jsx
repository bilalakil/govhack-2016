import React from 'react';
import {mount} from 'react-mounter';

import HomeView from './imports/views/Home';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        mount(HomeView);
    }
});