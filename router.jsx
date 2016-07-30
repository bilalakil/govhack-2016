import React from 'react';
import {mount} from 'react-mounter';

import Layout from './imports/views/Layout';
import HomeView from './imports/views/Home';

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        mount(Layout, {
            content: () => (<HomeView />)
        });
    }
});