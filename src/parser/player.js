import * as R from 'ramda';

//

export const SELECTOR = '#overview-section';

//

const intoNumber = n => parseInt(n, 10);

const getPlayer = root => root.find('.masthead-player');
const getPlayerName = node => node.find('.header-masthead').text();
const getPlayerLevel = node => node.find('.player-level > *').text();

//

export const parsePlayer = root => ({
  name: R.compose(getPlayerName,
                  getPlayer)(root.find(SELECTOR)),
  level: R.compose(intoNumber,
                   getPlayerLevel,
                   getPlayer)(root.find(SELECTOR)),
});
