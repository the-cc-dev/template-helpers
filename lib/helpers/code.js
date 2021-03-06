'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const object = require('./object');

/**
 * Embed code from an external file as preformatted text.
 *
 * ```js
 * <%= embed('path/to/file.js') %>
 *
 * // specify the language to use
 * <%= embed('path/to/file.hbs', 'html') %>
 * ```
 * @param {String} `fp` filepath to the file to embed.
 * @param {String} `language` Optionally specify the language to use for syntax highlighting.
 * @return {String}
 * @api public
 */

exports.embed = (fp, ext) => {
  ext = typeof ext !== 'string' ? path.extname(fp).slice(1) : ext;
  let code = fs.readFileSync(fp, 'utf8');

  // if the string is markdown, escape backticks
  if (ext === 'markdown' || ext === 'md') {
    code = code.split('`').join('&#x60');
  }
  return utils.toCodeBlock(code, ext) + '\n';
};

/**
 * Generate the HTML for a jsFiddle link with the given `params`
 *
 * ```js
 * <%= jsfiddle({id: '0dfk10ks', {tabs: true}}) %>
 * ```
 * @param {Object} `params`
 * @return {String}
 * @api public
 */

exports.jsfiddle = attr => {
  if (!attr || !object.isPlainObject(attr)) return '';
  attr.id = 'http://jsfiddle.net/' + (attr.id || '');
  attr.width = attr.width || '100%';
  attr.height = attr.height || '300';
  attr.skin = attr.skin || '/presentation/';
  attr.tabs = (attr.tabs || 'result,js,html,css') + attr.skin;
  attr.src = attr.id + '/embedded/' + attr.tabs;
  attr.allowfullscreen = attr.allowfullscreen || 'allowfullscreen';
  attr.frameborder = attr.frameborder || '0';
  attr = object.omit(attr, ['id', 'tabs', 'skin']);
  return '<iframe ' + utils.toAttributes(attr) + '></iframe>';
};
