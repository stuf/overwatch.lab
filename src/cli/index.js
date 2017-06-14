import Vorpal from 'vorpal';

const vorpal = Vorpal();

const NAME = 'ow.cli';

vorpal.history(NAME);

vorpal
  .command('foo', 'Outputs "lerssi"')
  .action(function fooAction(args, cb) {
    this.log('jorma');
    cb();
  });

vorpal
  .command('db', 'Database actions')
  .action(function dbAction(args, cb) {
    this.log('db action');
    cb();
  });

vorpal
  .delimiter(`${NAME}$`)
  .show()
  .parse(process.argv);
