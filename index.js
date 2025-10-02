'use strict';

/** @type {import('.')} */
/*
 * Fast path: Check for native support first
 * Modern engines (ES5+) have Object.defineProperty
 * Only IE8 and older browsers lack proper support
 */
var $defineProperty = (function () {
	// Early exit if defineProperty doesn't exist at all
	if (!Object.defineProperty) {
		return false;
	}

	// Cache the defineProperty reference for validation
	var definePropertyFn = Object.defineProperty;

	/*
	 * One-time validation check for broken implementations (IE8)
	 * Use a simple descriptor to minimize overhead
	 */
	try {
		var testValue = 1;
		definePropertyFn({}, 'a', { value: testValue });
		// If we get here, implementation works correctly
		return definePropertyFn;
	} catch (e) {
		// IE 8 has a broken defineProperty
		return false;
	}
}());

module.exports = $defineProperty;
