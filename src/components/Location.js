/** @format */

import React from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';

export default function Location({ name, point }) {
    return (
        <article>
            {name && <h2>{name}</h2>}
            <Map center={point} zoom={14} height={300}>
                <Marker anchor={point} payload={name} />
            </Map>
        </article>
    );
}
