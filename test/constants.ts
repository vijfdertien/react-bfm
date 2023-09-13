export const TEST_MAP_VALUE = new Map()
TEST_MAP_VALUE.set('foo', 'bar')

export const SUPPORTED_VALUES: any[] = [
  undefined,
  true,
  false,
  Symbol('foobar'),
  456n,
  123.45,
  123,
  -123.45,
  -123,
  'foobar',
  { foo: 'bar' },
  ['foo', 'bar'],
  TEST_MAP_VALUE,
]
