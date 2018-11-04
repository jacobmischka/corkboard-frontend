/** @format */

import React, { useState, useEffect } from 'react';
import { Router, Link } from '@reach/router';
import { css } from 'emotion';
import gql from 'graphql-tag';

import { client } from '../../apolloClient.js';

import PositionContext from '../../positionContext.js';

import List from './List.js';
import Map from './Map.js';
import Add from './Add.js';

import { shadow } from '../../styles.js';

const container = css`
    & > aside {
        grid-area: aside;

        & nav ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            grid-template-rows: 100px;
            grid-gap: 1em;
            padding: 0;
        }

        & nav ul li {
            display: block;
            background-color: powderblue;
            padding: 1em;
            font-size: 1.5em;
            text-align: center;

            box-shadow: ${shadow};
            & a {
                text-decoration: none;

                &,
                &:visited {
                    color: black;
                }
            }
        }
    }

    & > fieldset {
        border: none;
        padding: 2em;
        margin-top: 1em;
        background-color: lemonchiffon;
        box-shadow: ${shadow};

        & label,
        & select {
            display: block;

            & input {
                display: block;
            }
        }
    }

    & > section {
        grid-area: main;
    }
`;

const radiusOptions = [10, 50, 100, 150];

export default function Opportunities({ navigate }) {
    const position = usePosition();
    const [radius, setRadius] = useState(50);
    const [opportunities, fetchOpportunities] = useOpportunitiesNearMe(
        position,
        radius
    );

    return (
        <div className={container}>
            <aside>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">List</Link>
                        </li>
                        <li>
                            <Link to="map">Map</Link>
                        </li>
                        <li>
                            <Link to="add">Add</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <section>
                <PositionContext.Provider value={position}>
                    <Router>
                        <List path="/" opportunities={opportunities} />
                        <Map
                            path="map"
                            center={position}
                            opportunities={opportunities}
                        />
                        <Add
                            path="add"
                            onSubmit={() => {
                                fetchOpportunities().then(() => {
                                    navigate('.');
                                });
                            }}
                        />
                    </Router>
                </PositionContext.Provider>
            </section>

            <fieldset>
                {position && (
                    <label>
                        Search radius (miles)
                        <select
                            onChange={event => {
                                setRadius(Number(event.target.value));
                            }}
                            value={radius}
                        >
                            {radiusOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                            <option value="">Unlimited</option>
                        </select>
                    </label>
                )}
            </fieldset>
        </div>
    );
}

function useOpportunitiesNearMe(position, radius) {
    const [opportunities, setOpportunities] = useState([]);

    async function fetchOpportunities() {
        if (position && radius) {
            client
                .query({
                    fetchPolicy: 'network-only',
                    query: gql`
                        query OpportunitiesNearMe(
                            $lat: Float!
                            $lng: Float!
                            $radius: Float!
                        ) {
                            opportunitiesNearMe(
                                lat: $lat
                                lng: $lng
                                radius: $radius
                            ) {
                                id
                                title
                                location {
                                    name
                                    point
                                }
                                description
                                date
                                tags
                            }
                        }
                    `,
                    variables: {
                        lat: position[0],
                        lng: position[1],
                        radius
                    }
                })
                .then(result => {
                    setOpportunities(result.data.opportunitiesNearMe);
                });
        } else {
            client
                .query({
                    fetchPolicy: 'network-only',
                    query: gql`
                        {
                            votes {
                                id
                                title
                                location {
                                    name
                                    point
                                }
                                description
                                date
                                tags
                            }
                        }
                    `
                })
                .then(result => {
                    setOpportunities(result.data.votes);
                });
        }
    }

    useEffect(fetchOpportunities, [position, radius]);

    return [opportunities, fetchOpportunities];
}

function useOpportunities() {
    const [opportunities, setOpportunities] = useState([]);

    function fetchOpportunities() {
        client
            .query({
                query: gql`
                    {
                        votes {
                            id
                            title
                            location {
                                name
                                point
                            }
                            description
                            date
                            tags
                        }
                    }
                `
            })
            .then(result => {
                setOpportunities(result.data.votes);
            });
    }

    useEffect(fetchOpportunities, []);

    return [opportunities, fetchOpportunities];
}

function usePosition() {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                setPosition([
                    position.coords.latitude,
                    position.coords.longitude
                ]);
            });
        }
    }, []);

    return position;
}
