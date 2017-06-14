import * as R from 'ramda';
import * as L from 'partial.lenses';

const addSuffix = R.curry((suffix, str) => `${str}${suffix}`);

const joinWithSuffix = R.curry((suffix, str) => R.join(' - ', [str, suffix]));

const addSuffixes = R.curry((obj, suffix) =>
  R.mapObjIndexed(string => addSuffix(suffix, string), obj));

export const Translations = {
  avgElims: 'Eliminations - Average',
  avgDamageDone: 'Damage Done - Average',
  avgDeaths: 'Deaths - Average',
  avgFinalBlows: 'Final Blows - Average',
  avgHealingDone: 'Healing Done - Average',
  avgObjectiveKills: 'Objective Kills - Average',
  avgObjectiveTime: 'Objective Time - Average',
  avgSoloKills: 'Solo Kills - Average',
  avgTimeSpentOnFile: 'Time Spent on Fire - Average',
  mostInGameEliminations: 'Eliminations - Most in Game',
  mostInGameFinalBlows: 'Final Blows - Most in Game',
};
