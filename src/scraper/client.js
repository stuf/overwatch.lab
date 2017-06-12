/* eslint-disable import/prefer-default-export */
import * as U from 'karet.util';
import cheerio from 'cheerio';
import Kefir from 'kefir';
import rp from 'request-promise';

//

const getUrlForTag = (name, tag) => `https://playoverwatch.com/en-us/career/pc/eu/${name}-${tag}`;

const doRequest = uri => rp(uri);

const fromPromise = p => Kefir.fromPromise(p);

//

export const fetchProfile = (name, tag) =>
  U.seq(getUrlForTag(name, tag),
        U.flatMapLatest(doRequest),
        U.flatMapLatest(fromPromise),
        U.flatMapLatest(res => cheerio.load(res).root()));
