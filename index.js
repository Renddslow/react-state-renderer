const ReactDOM = require('react-dom');
const React = require('react');
const { has } = require('dot-prop');

// TODO:
// - Create a context provider for maintaining the stateRouter
// - Create a stateRouter consumer/HOC for wrapping components

module.exports = () => (stateRouter) => {
  const asr = {
    makePath: stateRouter.makePath,
    stateIsActive: stateRouter.stateIsActive,
  };

  const render = (context, cb) => {
    const { element, template, content, parameters } = context;
    const props = Object.assign({}, content, parameters, {
      asr,
    });

    // Element/Target is an actual DOM Node
    if (!has(element, 'root')) {
      const el = React.createElement(template, props);

      ReactDOM.render(el, element);

      return cb(null, { parents: [el], root: element });
    }

    const el = React.createElement(template, { asr });

    let currentEl = el;
    for (let i = element.parents.length - 1; i >= 0; i--) {
      currentEl = React.cloneElement(element.parents[i], {
        uiView: currentEl,
      });
    }

    ReactDOM.render(currentEl, element.root);
    cb(null, {
      parents: [...element.parents, el],
      root: element.root,
    });
  };

  return {
    render,
    reset: (context, cb) => {
      render(context, cb);
    },
    destroy: (renderedTemplateAPI, cb) => {
      cb();
    },
    getChildElement: (renderedTemplateAPI, cb) => {
      cb(null, renderedTemplateAPI);
    },
  };
};
