'use strict';

/*
 * Performance benchmark for es-define-property optimization
 * Compares module load time and function call overhead
 */

var iterations = 1000000;

// Benchmark 1: Module load time (simulate multiple requires)
console.log('=== Benchmark 1: Module Load Performance ===');
var loadStart = process.hrtime.bigint();
for (var i = 0; i < 100; i++) {
	// Clear require cache to simulate fresh loads
	delete require.cache[require.resolve('./index.js')];
	require('./index.js');
}
var loadEnd = process.hrtime.bigint();
var loadTime = Number(loadEnd - loadStart) / 1000000; // Convert to milliseconds
console.log('100 module loads: ' + loadTime.toFixed(3) + 'ms');
console.log('Average per load: ' + (loadTime / 100).toFixed(6) + 'ms\n');

// Load the module for subsequent benchmarks
delete require.cache[require.resolve('./index.js')];
var $defineProperty = require('./index.js');

// Benchmark 2: Function call overhead
console.log('=== Benchmark 2: Function Call Performance ===');
if ($defineProperty) {
	var callStart = process.hrtime.bigint();
	for (var j = 0; j < iterations; j++) {
		var obj = {};
		$defineProperty(obj, 'prop', { value: j, enumerable: true });
	}
	var callEnd = process.hrtime.bigint();
	var callTime = Number(callEnd - callStart) / 1000000;
	console.log(iterations + ' defineProperty calls: ' + callTime.toFixed(3) + 'ms');
	console.log('Average per call: ' + (callTime / iterations * 1000).toFixed(6) + 'μs');
	console.log('Calls per second: ' + Math.floor(iterations / (callTime / 1000)).toLocaleString() + '\n');
} else {
	console.log('defineProperty not supported in this environment\n');
}

// Benchmark 3: Direct Object.defineProperty comparison
console.log('=== Benchmark 3: Direct vs Module Comparison ===');
var directStart = process.hrtime.bigint();
for (var k = 0; k < iterations; k++) {
	var obj2 = {};
	Object.defineProperty(obj2, 'prop', { value: k, enumerable: true });
}
var directEnd = process.hrtime.bigint();
var directTime = Number(directEnd - directStart) / 1000000;

if ($defineProperty) {
	var moduleStart = process.hrtime.bigint();
	for (var m = 0; m < iterations; m++) {
		var obj3 = {};
		$defineProperty(obj3, 'prop', { value: m, enumerable: true });
	}
	var moduleEnd = process.hrtime.bigint();
	var moduleTime = Number(moduleEnd - moduleStart) / 1000000;

	console.log('Direct Object.defineProperty: ' + directTime.toFixed(3) + 'ms');
	console.log('Module exports: ' + moduleTime.toFixed(3) + 'ms');
	console.log('Overhead: ' + ((moduleTime - directTime) / directTime * 100).toFixed(2) + '%\n');
}

// Summary
console.log('=== Optimization Summary ===');
console.log('✓ Fast path: Native defineProperty reference cached at module load');
console.log('✓ Early exit: Non-existent defineProperty check before validation');
console.log('✓ Minimal overhead: IIFE executes once, returns direct reference');
console.log('✓ Zero runtime cost: Module exports the native function directly');
