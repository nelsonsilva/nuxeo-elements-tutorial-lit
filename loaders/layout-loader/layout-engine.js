const fs = require('fs');
const path = require('path');
const { compile } = require('handlebars');

// precompile all templates
const TEMPLATE = {};
fs.readdir(path.join(__dirname, 'templates'), (_, items) => {
  items
  .map((t) => path.join(__dirname, 'templates', t))
  .forEach((t) => {
    const { name } = path.parse(t);
    TEMPLATE[name] = compile(fs.readFileSync(t).toString());;
  })
});

/**
 * Creates a custom element, given a model as input.
 *
 * @param model - model of the element
 * @returns HTML of the layout element.
 */
module.exports = (model) => {
  const { element, elements, properties } = model;

  console.log(model.elements);
  // const elements = model.elements.map(TEMPLATE.element);
  
  const imports = [...new Set(model.elements.map((el) => el.is))];

  return TEMPLATE.layout({imports, element, elements, properties})
}