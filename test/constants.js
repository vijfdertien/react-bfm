const mapValue = new Map()
mapValue.set('foo', 'bar')

export const SUPPORTED_VALUES = [
  undefined,
  true,
  false,
  Symbol('foobar'),
  456n,
  123.45,
  'foobar',
  { foo: 'bar' },
  ['foo', 'bar'],
  mapValue,
]
