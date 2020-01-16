var increment = require('../index');
var assert = require("chai").assert;
var expect = require("chai").expect;
var should    = require("chai").should();

describe('index.js tests', function () {
    before(function(){
        // runs before all tests in this block // puede servir para abrir conexiones a bd, inicializar cosas ,etc.
        var result;
    });
    after(function() {
		// runs after all tests in this block
	});
	beforeEach(function() {
		// runs before each test in this block
	});
	afterEach(function() {
	   // runs after each test in this block
	   result = null; 
	});	
    //para describir lo que estamos testeando. 
    describe('increment function tests using EQUALS', function () {

        it('increments a positive number', function () {
            result = increment(1);
            assert.equal(result, 2);
        });

        it('increments a negative number', function () {
            result = increment(-10);
            assert.equal(result, -9);
        });

        it('fails on strings', function () {
            assert.throws(function () {
                increment("purple");
            });
        });

        it('increments is a number', ()=>{
            result = increment(2);
            assert.typeOf(result, "number"); // tambien puede ser string , null, undefined, object . etc.
        });

    });

    describe('Increment function tests using EXPECT', function(){
        it('increments a positive number', function () {
            result = increment(1);
            expect(result).to.equal(2);
        });

        it('increments a negative number', function () {
            result = increment(-10);
            expect(result).to.equal(-9);
        });

        it('fails on strings', function () {
            expect(()=> increment("purple")).to.throw(); // hay q pasarle una funcion para que la analice
        });

        it('increments is a number', ()=>{
            result = increment(2);
            expect(result).to.be.a("number");
        });
    });

    describe('Increment function tests using SHOULD', function(){
        it('increments a positive number', function () {
            result = increment(1);
            result.should.equal(2);
        });

        it('increments a negative number', function () {
            result = increment(-10);
            result.should.equal(-9);
        });

        it('fails on strings', function () {
            ()=> increment("purple").should.throw();
            //expect(()=> increment("purple")).to.throw(); // hay q pasarle una funcion para que la analice
        });

        it('increments is a number', ()=>{
            result = increment(2);
            result.should.be.a("number");
        });
    });
});
// para correr los tests poner en consola: ./node_modules/.bin/mocha 

//tutorial usado: https://www.paradigmadigital.com/dev/testeando-javascript-mocha-chai/