import { expect } from 'chai'
import { generateSpec } from './spec-generator'

describe('generateSpec', () => {
  it('should be a function', () => {
    expect(generateSpec).to.be.function
  })

  it('should generate spec if given true', () => {
    let result = generateSpec(true)
    expect(result).be.a('array');
    expect(result).be.length(1);
    expect(result[0]).be.equal('expect(result).be.equal(true);');
  })

  it('should generate spec if given false', () => {
    let result = generateSpec(false)
    expect(result).be.a('array');
    expect(result).be.length(1);
    expect(result[0]).be.equal('expect(result).be.equal(false);');
  })

  it('should generate spec if given defined', () => {
    let result = generateSpec('defined', { special: true })
    expect(result).be.a('array');
    expect(result).be.length(1);
    expect(result[0]).be.equal('expect(result).be.defined;');
  })

  it('should generate spec if given undefined', () => {
    let result = generateSpec(undefined)
    expect(result).be.a('array');
    expect(result).be.length(1);
    expect(result[0]).be.equal('expect(result).be.undefined;');
  })

  it('should generate spec if given empty object', () => {
    let result = generateSpec({})
    expect(result).be.a('array');
    expect(result).be.length(1);
    expect(result[0]).be.equal('expect(result).be.a(\'object\');');
  })

  it('should generate spec if given empty array', () => {
    let result = generateSpec([])
    expect(result).be.a('array');
    expect(result).be.length(3);
    expect(result[0]).be.equal('expect(result).be.a(\'array\');');
    expect(result[1]).be.equal('expect(result).be.length(0);');
  })

  it('should generate spec if given array of strings', () => {
    let result = generateSpec(['a', 'b', 'c'])
    expect(result).be.a('array');
    expect(result).be.length(6);
    expect(result[0]).be.equal('expect(result).be.a(\'array\');');
    expect(result[1]).be.equal('expect(result).be.length(3);');
    expect(result[2]).be.equal('expect(result[0]).be.equal(\'a\');');
    expect(result[3]).be.equal('expect(result[1]).be.equal(\'b\');');
    expect(result[4]).be.equal('expect(result[2]).be.equal(\'c\');');
  })

  it('should generate spec if given an object', () => {
    let result = generateSpec({ firstName: 'John', lastName: 'Doe' })
    expect(result).be.a('array');
    expect(result).be.length(7);
    expect(result[0]).be.equal('expect(result).be.a(\'object\');');
    expect(result[1]).be.equal('expect(result).have.property(\'firstName\');');
    expect(result[2]).be.equal('expect(result.firstName).be.equal(\'John\');');
    expect(result[3]).be.equal('');
    expect(result[4]).be.equal('expect(result).have.property(\'lastName\');');
    expect(result[5]).be.equal('expect(result.lastName).be.equal(\'Doe\');');
    expect(result[6]).be.equal('');
  })

  it('should generate spec if given an array of objects', () => {
    let result = generateSpec([
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'John', lastName: 'Doe' }
    ])

    expect(result).be.a('array');
    expect(result).be.length(16);
    expect(result[0]).be.equal('expect(result).be.a(\'array\');');
    expect(result[1]).be.equal('expect(result).be.length(2);');
    expect(result[2]).be.equal('expect(result[0]).be.a(\'object\');');
    expect(result[3]).be.equal('expect(result[0]).have.property(\'firstName\');');
    expect(result[4]).be.equal('expect(result[0].firstName).be.equal(\'John\');');
    expect(result[5]).be.equal('');
    expect(result[6]).be.equal('expect(result[0]).have.property(\'lastName\');');
    expect(result[7]).be.equal('expect(result[0].lastName).be.equal(\'Doe\');');
    expect(result[8]).be.equal('');
    expect(result[9]).be.equal('expect(result[1]).be.a(\'object\');');
    expect(result[10]).be.equal('expect(result[1]).have.property(\'firstName\');');
    expect(result[11]).be.equal('expect(result[1].firstName).be.equal(\'John\');');
    expect(result[12]).be.equal('');
    expect(result[13]).be.equal('expect(result[1]).have.property(\'lastName\');');
    expect(result[14]).be.equal('expect(result[1].lastName).be.equal(\'Doe\');');
    expect(result[15]).be.equal('');
  })

  it('should generate spec if object with inner objects is given', () => {
    let result = generateSpec({
      firstName: 'John',
      lastName: 'Doe',
      manager: { firstName: 'John', lastName: 'Doe' }
    })
    expect(result).be.a('array');
    expect(result).be.length(15);
    expect(result[0]).be.equal('expect(result).be.a(\'object\');');
    expect(result[1]).be.equal('expect(result).have.property(\'firstName\');');
    expect(result[2]).be.equal('expect(result.firstName).be.equal(\'John\');');
    expect(result[3]).be.equal('');
    expect(result[4]).be.equal('expect(result).have.property(\'lastName\');');
    expect(result[5]).be.equal('expect(result.lastName).be.equal(\'Doe\');');
    expect(result[6]).be.equal('');
    expect(result[7]).be.equal('expect(result).have.property(\'manager\');');
    expect(result[8]).be.equal('expect(result.manager).be.a(\'object\');');
    expect(result[9]).be.equal('expect(result.manager).have.property(\'firstName\');');
    expect(result[10]).be.equal('expect(result.manager.firstName).be.equal(\'John\');');
    expect(result[11]).be.equal('');
    expect(result[12]).be.equal('expect(result.manager).have.property(\'lastName\');');
    expect(result[13]).be.equal('expect(result.manager.lastName).be.equal(\'Doe\');');
    expect(result[14]).be.equal('');
  })

  it('should return an empty array if an invalid special string is given', () => {
    let result = generateSpec('invalid-string', { special: true })
    expect(result).be.a('array');
    expect(result).be.length(0);
  })

  it('should quote property name if it contains special character', () => {
    let result = generateSpec({ 'Content-Type': 'application/json' })
    expect(result).be.a('array');
    expect(result).be.length(4);
    expect(result[0]).be.equal('expect(result).be.a(\'object\');');
    expect(result[1]).be.equal('expect(result).have.property(\'Content-Type\');');
    expect(result[2]).be.equal('expect(result[\'Content-Type\']).be.equal(\'application/json\');');
    expect(result[3]).be.equal('');
  })

  it('should generate spec if an object with one of the property array is given', () => {
    let result = generateSpec({ names: ['John', 'Doe'] })
    expect(result).be.a('array');
    expect(result).be.length(7);
    expect(result[0]).be.equal('expect(result).be.a(\'object\');');
    expect(result[1]).be.equal('expect(result).have.property(\'names\');');
    expect(result[2]).be.equal('expect(result.names).be.a(\'array\');');
    expect(result[3]).be.equal('expect(result.names).be.length(2);');
    expect(result[4]).be.equal('expect(result.names[0]).be.equal(\'John\');');
    expect(result[5]).be.equal('expect(result.names[1]).be.equal(\'Doe\');');
    expect(result[6]).be.equal('');
  })

  it('should not quote the property value if it is not string', () => {
    let result = generateSpec({ age: 20, active: false })
    expect(result).be.a('array');
    expect(result).be.length(7);
    expect(result[0]).be.equal('expect(result).be.a(\'object\');');
    expect(result[1]).be.equal('expect(result).have.property(\'age\');');
    expect(result[2]).be.equal('expect(result.age).be.equal(20);');
    expect(result[3]).be.equal('');
    expect(result[4]).be.equal('expect(result).have.property(\'active\');');
    expect(result[5]).be.equal('expect(result.active).be.equal(false);');
    expect(result[6]).be.equal('');
  })

})