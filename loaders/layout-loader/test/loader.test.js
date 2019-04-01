const compiler = require('./helpers/compiler');
const { expect } = require('chai');
const path = require('path');

describe('loader', () => {
  it('should work', async () => {

    const stats = await compiler('fixtures/layouts/dummy-layout');
    
    // console.log(stats)
    
    const { assets, modules } = stats.toJson();

    const output = modules[0].source;

    const jsLayouts = assets.filter(({ name }) => /\-layout.js$/.test(name))

    expect(jsLayouts.length).to.equal(1)

    expect(jsLayouts[0].name).to.equal(path.join(__dirname, 'fixtures/layouts/dummy-layout.js'));

    //expect(output).toBe('export default "Hey Alice!\\n"');
  });
});