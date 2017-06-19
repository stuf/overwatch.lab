import K, * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';
import { fromNodeCallback as fromCb } from 'kefir';

import * as H from '../common/util';
import { Heroes } from './constants';

const x = H.x;

const fromEls = prop => [L.elems, prop];
const intoObject = R.compose(R.transpose, R.splitEvery(2));

const childData = [L.elems,
                   'children',
                   L.elems,
                   L.props('hero', 'progress')];

export const parse =
  r => H.fromCb(x(r, '.hero-comparison-section .progress-category', [{
    id: '@data-category-id | blizGuidFromAttr',
    children: x('.progress-2', [{
      hero: '> img@src | blizGuidFromImg',
      progress: '@data-overwatch-progress-percent | asFloat',
    }]),
  }]));

export const parseComparisons =
  U.pipe(U.flatMapLatest(parse),
         U.flatMapLatest(L.modify(childData, intoObject)));
