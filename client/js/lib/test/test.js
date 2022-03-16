/*JS Unit Testing using Jest*/

const decode = require('../bison').decode;
const encode = require('../bison').encode;

/* Test 1: encode and decode a simple object */
test('Test 1: encode and decode a simple object', () => {
    let obj = {
        name: 'John',
        age: 30,
        isMarried: true
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 2: encode and decode an array */
test('Test 2: encode and decode an array', () => {
    let obj = [1, 2, 3, 4, 5];
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 3: encode and decode a nested array */
test('Test 3: encode and decode a nested array', () => {
    let obj = [1, 2, [3, 4, 5]];
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/ * Test 4: encode and decode a nested object */
test('Test 4: encode and decode a nested object', () => {
    let obj = {
        name: 'John',
        age: 30,
        isMarried: true,
        children: [{
            name: 'Jack',
            age: 2
        }, {
            name: 'Jill',
            age: 3
        }]
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 5: encode and decode for float values in an object */
test('Test 5: encode and decode for float values in an object', () => {
    let obj = {
        name: 'John',
        age: 30.5,
        isMarried: true
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 6: encode and decode for boolean values in an object */
test('Test 6: encode and decode for boolean values in an object', () => {
    let obj = {
        name: 'John',
        age: 30,
        isMarried: true
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 7: encode and decode for null values in an object */
test('Test 7: encode and decode for null values in an object', () => {
    let obj = {
        name: 'John',
        age: 30,
        isMarried: true,
        children: null
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 8: encode and decode for float with large values in an object */
test('Test 8: encode and decode for float with large values in an object', () => {
    let obj = {
        name: 'John',
        age: 3000000.0,
        isMarried: true
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 9: encode and decode for float with small values in an object */
test('Test 9: encode and decode for float with small values in an object', () => {
    let obj = {
        name: 'John',
        age: 0.0001,
        isMarried: true
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});

/* Test 10: encode and decode for object with very long string values */
test('Test 10: encode and decode for object with very long string values', () => {
    let obj = {
        name: 'John',
        age: 30,
        isMarried: true,
        children: 'Children is a very long string that is longer than the max length of a string in Bison'
    }
    let encoded = encode(obj);
    console.log (encoded);
    let decoded = decode(encoded);
    console.log(decoded);
    expect(decoded).toEqual(obj);
});