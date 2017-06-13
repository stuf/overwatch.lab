import * as U from 'karet.util';

import { fetchProfile } from './client';
import { fetchMockProfile } from './mock';

//

/**
 * Fetches and parses a user's public profile/career page
 * @param {string} name
 * @param {string} tag
 */
export const getProfileFor = (name, tag) => fetchProfile(name, tag);

export const getMockProfile = () => fetchMockProfile();

/**
 * Fetches and parses a list of profiles
 * @param {Array<*>} ps
 */
export const getProfilesFor = (...ps) =>
  U.seq(ps,
        U.map(U.apply(getProfileFor, U.of(U.__))),
        U.parallel);
