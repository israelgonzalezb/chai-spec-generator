
function newLine(specs) {
  if (specs.slice(-1)[0] !== '') {
    specs.push('');
  }
}

interface Options {
  context?: string
  specs?: string[]
  special?: boolean
  quote?: string
  quoteType?: string
  semicolon?: boolean
}

export function generateSpec(target: any, options?: Options) {
  options = Object.assign({
    context: 'expect(result)',
    specs: [],
    quote: '\'',
    semicolon: true,
    special: false
  }, options)

  return generateSpecForChai(target, options)
}

function generateSpecForChai(target: any, options: Options) {
  const q = options.quote;
  const s = options.semicolon ? ';' : ''

  if (options.special) {
    if (target === 'defined') {
      return [`${options.context}.be.defined${s}`]
    }
    return []
  }

  if (target instanceof Array) {
    options.specs.push(`${options.context}.be.a(${q}array${q})${s}`);
    options.specs.push(`${options.context}.be.length(${target.length})${s}`);
    target.map(function (item, index) {
      generateSpecForChai(item, Object.assign({}, options, {
        context: `${options.context.replace(/\)$/, '')}[${index}])`
      }));
    });
    newLine(options.specs);

  } else if (typeof target === 'object') {
    options.specs.push(`${options.context}.be.a(${q}object${q})${s}`);
    Object.keys(target).map(function (key) {
      options.specs.push(`${options.context}.have.property(${q}${key}${q})${s}`);
      let keyRef = /^[a-zA-Z0-9_]+$/g.test(key) ? `.${key}` : `[${q}${key}${q}]`;
      let contextRef = `${options.context.replace(/\)$/, '')}${keyRef})`;
      if (target[key] instanceof Array) {
        generateSpecForChai(target[key], Object.assign({}, options, { context: contextRef }));
      } else if (typeof target[key] === 'object') {
        generateSpecForChai(target[key], Object.assign({}, options, { context: contextRef }));
      } else if (isNaN(target[key])) {
        options.specs.push(`${contextRef}.be.equal(${q}${target[key]}${q})${s}`);
      } else {
        options.specs.push(`${contextRef}.be.equal(${target[key]})${s}`);
      }
      newLine(options.specs);
    });

  } else if (target == undefined) {
    options.specs.push(`${options.context}.be.undefined${s}`);

  } else if (typeof target === 'string') {
    options.specs.push(`${options.context}.be.equal(${q}${target}${q})${s}`);

  } else {
    options.specs.push(`${options.context}.be.equal(${target})${s}`);
  }

  return options.specs;
}
