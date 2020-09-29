/**
 * @fileoverview Enforce $varName for jQuery assignment.
 * @author Erik Desjardins
 * @copyright 2013-2016 JSCS contributors. All rights reserved.
 * @copyright 2016 Erik Desjardins. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict';

module.exports = function(context) {
	var ignoreProperties = context.options[0] === 'ignoreProperties';

	function shouldVarNameStartWithDollar(name, assignee) {
		return (
			name && !(/^_?\$/).test(name) &&
			assignee && assignee.type === 'CallExpression' &&
			assignee.callee.type === 'Identifier' && assignee.callee.name === '$'
		);
	}

	function reportIdentifier(identifier, fix) {
		var reportObj = {
			node: identifier,
			message: 'jQuery identifiers must start with a $'
		};

		if (fix) {
			reportObj.fix = function(fixer) {
				return fixer.insertTextBefore(identifier, '$');
			};
		}

		context.report(reportObj);
	}

	function collectReferenceIdentifiers(variable) {
		var allRefs = variable.references.concat(variable.scope.references);
		var refs = variable.identifiers.slice();
		var i, id;

		// avoid adding duplicate references
		for (i = 0; i < allRefs.length; ++i) {
			id = allRefs[i].identifier;

			if (refs.indexOf(id) !== -1) continue;

			if (id.name === variable.name) {
				refs.push(id);
			}
		}

		return refs;
	}

	function reportAllReferences(variable) {
		var refs = collectReferenceIdentifiers(variable);
		var autofix = true;
		var i, id;

		for (i = 0; i < refs.length; ++i) {
			id = refs[i];
			if (id.parent.type === 'Property' && id.parent.shorthand) {
				// if any reference is used for a shorthand property, don't autofix
				autofix = false;
				break;
			}
		}

		for (i = 0; i < refs.length; ++i) {
			id = refs[i];
			reportIdentifier(id, autofix);
		}
	}

	function shouldVarAssignmentStartWithDollar(def, variable) {
		var refs = collectReferenceIdentifiers(variable);
		var i, parent;

		for (i = 0; i < refs.length; ++i) {
			parent = refs[i].parent;

			if (parent.type !== 'AssignmentExpression' || parent.operator !== '=') continue;

			if (shouldVarNameStartWithDollar(def.name.name, parent.right)) return true;
		}

		return false;
	}

	function checkVarDeclarations(scope) {
		var i, variable, def;

		for (i = 0; i < scope.variables.length; ++i) {
			variable = scope.variables[i];

			if (!variable.defs.length) continue;
			def = variable.defs[0];

			if (!def.node.id || def.node.id.type === 'ObjectPattern' || def.node.id.type === 'ArrayPattern') continue;

			if (
				def.node.init ?
					shouldVarNameStartWithDollar(def.name.name, def.node.init) :
					shouldVarAssignmentStartWithDollar(def, variable)
			) {
				reportAllReferences(variable);
			}
		}

		for (i = 0; i < scope.childScopes.length; ++i) {
			checkVarDeclarations(scope.childScopes[i]);
		}
	}

	function checkAssignmentExpressionForObject(node) {
		if (ignoreProperties) {
			return;
		}

		var left = node.left;
		if (left.computed) {
			return;
		}

		if (left.type === 'ObjectPattern' || left.type === 'ArrayPattern') {
			return;
		}

		if (!left.property) {
			return;
		}

		if (shouldVarNameStartWithDollar(left.property.name, node.right)) {
			reportIdentifier(left.property, false);
		}
	}

	function checkObjectExpression(node) {
		if (ignoreProperties) {
			return;
		}

		var props = node.properties;

		if (!props) {
			return;
		}

		props.forEach(function(prop) {
			var left = prop.key;

			if (!left) {
				return;
			}

			if (shouldVarNameStartWithDollar(left.name, prop.value)) {
				reportIdentifier(left, false);
			}
		});
	}

	return {
		ObjectExpression: checkObjectExpression,
		AssignmentExpression: checkAssignmentExpressionForObject,
		'Program:exit': function() {
			checkVarDeclarations(context.getScope());
		}
	};
};

module.exports.schema = [
	{
		enum: ['ignoreProperties']
	}
];
