/** @format */

import React from 'react';
import { css } from 'emotion';
import { DateTime } from 'luxon';

import Location from '../Location.js';

const vote = css`
    & pre {
        font-family: sans-serif;
    }
`;

export default function Vote({ title, location, description, date, tags }) {
    const dateTime = new DateTime.utc(date);

    return (
        <article className={vote}>
            <h2>{title}</h2>

            {/*
				<time dateTime={dateTime.toISO()}>{dateTime.toLocaleString()}</time>
			*/}
            <div>
                <pre>{description}</pre>
            </div>

            <Location {...location} />

            <ul>{tags && tags.map(tag => <li>{tag}</li>)}</ul>
        </article>
    );
}
