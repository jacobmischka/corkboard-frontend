/** @format */

import React, { useContext } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import gql from 'graphql-tag';
import { DateTime } from 'luxon';
import { css } from 'emotion';

import { client } from '../../apolloClient.js';

import PositionContext from '../../positionContext.js';

import { shadow } from '../../styles.js';

const addContainer = css`
    background-color: white;
    border: 1px solid #aaa;
    border-radius: 2px;
    padding: 2em;
    box-shadow: ${shadow};

    & label {
        display: block;

        & input {
            display: block;
            width: calc(100% - 20px);
        }

        & textarea {
            display: block;
            width: 100%;
        }
    }

    & .flatpickr-input {
    }
`;

const newVoteSchema = yup.object().shape({
    title: yup.string().required('Required'),
    locationName: yup.string(),
    lat: yup.number().required('Required'),
    lng: yup.number().required('Required'),
    description: yup.string().required('Required'),
    date: yup.date().required('Required'),
    tags: yup.array().of(yup.string())
});

export default function AddOpportunity({ onSubmit, navigate }) {
    const position = useContext(PositionContext);

    return (
        <div className={addContainer}>
            <h2>New post</h2>
            <Formik
                initialValues={{
                    title: '',
                    locationName: '',
                    lat: null,
                    lng: null,
                    description: '',
                    date: null,
                    tags: []
                }}
                validationSchema={newVoteSchema}
                onSubmit={(newVote, { setSubmitting }) => {
                    newVote = {
                        ...newVote,
                        date: newVote.date.valueOf()
                    };

                    client
                        .mutate({
                            mutation: gql`
                                mutation CreateVoteOpportunity(
                                    $newVote: VoteInput!
                                ) {
                                    createVote(newVote: $newVote) {
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
                                newVote
                            }
                        })
                        .then(({ data }) => {
                            onSubmit(data.createVote);
                        })
                        .catch(err => {
                            setSubmitting(false);
                        });
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    isSubmitting
                }) => (
                    <Form>
                        <label>
                            Title
                            <Field type="text" name="title" />
                            <ErrorMessage name="title" />
                        </label>
                        <label>
                            Description
                            <Field component="textarea" name="description" />
                            <ErrorMessage name="description" />
                        </label>

                        <label>
                            Date
                            <Flatpickr
                                options={{
                                    enableTime: true
                                }}
                                onChange={([date]) => {
                                    setFieldValue('date', date);
                                }}
                            />
                            <ErrorMessage name="date" />
                        </label>

                        <fieldset>
                            <legend>Tags</legend>
                            <FieldArray
                                name="tags"
                                render={arrayHelpers => (
                                    <div>
                                        {values.tags &&
                                            values.tags.length > 0 &&
                                            values.tags.map((tag, index) => (
                                                <li key={index}>
                                                    <Field
                                                        name={`tags.${index}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            arrayHelpers.remove(
                                                                index
                                                            );
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                </li>
                                            ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                arrayHelpers.push('');
                                            }}
                                        >
                                            Add tag
                                        </button>
                                    </div>
                                )}
                            />
                            <ErrorMessage name="tags" />
                        </fieldset>

                        <fieldset>
                            <legend>Location</legend>
                            <label>
                                Location name
                                <Field type="text" name="locationName" />
                                <ErrorMessage name="locationName" />
                            </label>
                            {position && (
                                <Map
                                    center={position}
                                    zoom={13}
                                    height={300}
                                    onClick={({ latLng }) => {
                                        setFieldValue('lat', latLng[0]);
                                        setFieldValue('lng', latLng[1]);
                                    }}
                                >
                                    {values.lat &&
                                        values.lng && (
                                            <Marker
                                                anchor={[
                                                    values.lat,
                                                    values.lng
                                                ]}
                                            />
                                        )}
                                </Map>
                            )}
                            {(errors.lat || errors.lng) && (
                                <p>Please select a location</p>
                            )}
                        </fieldset>

                        <button type="submit" disabled={isSubmitting}>
                            Add post
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                navigate('..');
                            }}
                        >
                            Cancel
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
