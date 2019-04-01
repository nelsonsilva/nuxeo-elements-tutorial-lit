const path = require('path');
const generate = require('./layout-engine');

module.exports = function(source) {
  console.log('LAYOUT LOADER');
  console.log(this.resourcePath);

  const callback = this.async()
  
  const { dir, name, ext } = path.parse(this.resourcePath);

  const target = path.join(dir, `${name}.js`);

  if (ext == '.json') {
    const layout = JSON.parse(source);
    const content = generate(layout);

    console.debug(content);
    this.emitFile(`${target}`, `export default ${ JSON.stringify(source) }`);
  }

  //return `export default ${ JSON.stringify(source) }`;
  callback(null, '');
}