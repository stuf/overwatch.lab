import Logdown from 'logdown';

export const mkLogger = name => Logdown(name, { alignOutput: true });
