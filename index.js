const ReactDOM = require('react-dom');
const React = require('react');
const { get, has } = require('dot-prop');

module.exports = () => (stateRouter) => ({
  render: (context, cb) => {
    if (!has(context.element, 'root')) {
      const el = React.createElement(context.template);

      ReactDOM.render(el, context.element);

      return cb(null, { parents: [el], root: context.element });
    }

    const el = React.createElement(context.template);

    let currentEl = el;
    for (let i = context.element.parents.length - 1; i >= 0; i--) {
      console.log(currentEl);
      currentEl = React.cloneElement(context.element.parents[i], {
        uiView: currentEl,
      });
    }

    ReactDOM.render(currentEl, context.element.root);
    cb(null, {
      parents: [...context.element.parents, el],
      root: context.element.root,
    });
  },
  reset: (context, cb) => {
    cb(null);
  },
  destroy: (renderedTemplateAPI, cb) => {
  },
  getChildElement: (renderedTemplateAPI, cb) => {
    cb(null, renderedTemplateAPI);
  },
});
