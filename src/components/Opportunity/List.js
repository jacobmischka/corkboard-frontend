import React from 'react';
import { css } from 'emotion';

import Vote from './Vote.js';

import pin from '../../pin.png';

const listContainer = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 1em;
    padding: 1em;

	& .vote-container {
		position: relative;
		border: 1px solid #aaa;
		border-radius: 2px;
		padding: 1em;
		background-color: white;
		box-shadow: -5px 5px 5px 0 rgba(0, 0, 0, 0.25);

		& > .pin {
			width: 50px;
			height: auto;
			position: absolute;
			top: -5px;
			left: calc(50% - 25px);
		}
	}
`;

export default function List({ opportunities }) {
    return (
        <div className={listContainer}>
			{opportunities && opportunities.length > 0
				?  opportunities.map(o => (
					<div className="vote-container">
						<img class="pin" src={pin} alt="" />
						<Vote key={o.id} {...o} />
					</div>
				))
				: (
					<div className="vote-container">
						<p>Nothing :(</p>
					</div>
				)
			}
        </div>
    );
}

