/** @format */

import React from 'react';
import { Router } from '@reach/router';
import { css } from 'emotion';

import Home from './Home.js';
import Opportunities from './Opportunity/Opportunities.js';

import { shadow } from '../styles.js';

const container = css`
    & > h1 {
        display: block;
        padding: 1em;
        background-color: white;
        box-shadow: ${shadow};
        margin-top: 0;
    }
`;

export default function App() {
    return (
        <div className={container}>
            <h1>Community corkboard</h1>
            <Router>
                <Opportunities path="/*" />
            </Router>
        </div>
    );
}
