/** @format */

import React, { useState } from 'react';
import { css } from 'emotion';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

import Vote from './Vote.js';

import { shadow } from '../../styles.js';

const container = css`
    & dialog {
        z-index: 100;
        width: 80vw;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: ${shadow};
    }

    & .map-container > div {
        box-shadow: ${shadow};
    }
`;

export default function OpportunityMap({ center, opportunities }) {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    const markers = opportunities.map(o => (
        <Marker
            key={o.id}
            anchor={o.location.point}
            payload={o}
            onClick={({ payload }) => {
                setSelectedOpportunity(payload);
            }}
        />
    ));

    if (!center && opportunities.length > 0) {
        center = opportunities[0].location.point;
    }

    if (!center) {
        center = [0, 0];
    }

    return (
        <div className={container}>
            {selectedOpportunity && (
                <dialog open>
                    <Vote {...selectedOpportunity} />
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedOpportunity(null);
                        }}
                    >
                        Close
                    </button>
                </dialog>
            )}
            <div className="map-container">
                <Map center={center} defaultZoom={13} height={600}>
                    {markers}
                </Map>
            </div>
        </div>
    );
}
