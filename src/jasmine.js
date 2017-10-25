import Given from './given';

let it = false;

const given = new Given((define) => {
  if (it) define();
  else beforeEach(() => define());
});

beforeEach(() => { it = true; });
afterEach(() => { it = false; given.__clear__(); });

global.given = given;
export default given;
