'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = postformatting;

var _apartment = require('apartment');

var _apartment2 = _interopRequireDefault(_apartment);

var _cssForkPocketjoso = require('css-fork-pocketjoso');

var _cssForkPocketjoso2 = _interopRequireDefault(_cssForkPocketjoso);

var _embeddedBase64Remover = require('./embedded-base64-remover');

var _embeddedBase64Remover2 = _interopRequireDefault(_embeddedBase64Remover);

var _unusedFontfaceRemover = require('./unused-fontface-remover');

var _unusedFontfaceRemover2 = _interopRequireDefault(_unusedFontfaceRemover);

var _unusedKeyframeRemover = require('./unused-keyframe-remover');

var _unusedKeyframeRemover2 = _interopRequireDefault(_unusedKeyframeRemover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function postformatting({
  criticalAstRules,
  propertiesToRemove,
  maxEmbeddedBase64Length,
  debuglog
}) {
  const usedCriticalRules = (0, _unusedKeyframeRemover2.default)(criticalAstRules);
  debuglog('postformatting: unusedKeyframeRemover');

  let finalCss = _cssForkPocketjoso2.default.stringify({
    stylesheet: {
      rules: usedCriticalRules
    }
  });
  debuglog('postformatting: stringify from ast');

  // remove data-uris that are too long
  // ..faster if this removal can be combined with @font-face one into same iteration..
  finalCss = (0, _embeddedBase64Remover2.default)(finalCss, maxEmbeddedBase64Length);
  debuglog('postformatting: embeddedbase64Remover');

  // remove unused @fontface rules
  finalCss = (0, _unusedFontfaceRemover2.default)(finalCss);
  debuglog('postformatting: ffRemover');

  debuglog('postformatting: propertiesToRemove');
  // remove irrelevant css properties
  finalCss = (0, _apartment2.default)(finalCss, {
    properties: propertiesToRemove,
    // TODO: move into pruneNonCriticalCss script
    selectors: ['::(-moz-)?selection']
  });
  debuglog('postformatting: cleaned css via apartment');

  return finalCss;
}