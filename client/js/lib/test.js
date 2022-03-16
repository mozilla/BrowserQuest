/*JS Unit Testing using Jest*/

const decode = require('./bison').decode;
const encode = require('./bison').encode;

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
