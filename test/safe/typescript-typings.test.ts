import * as td from '../..'
import * as assert from 'assert'

class Dog {
  bark () {}
}

class Cat {
  meow (): string {
    return 'meow! meow!'
  }
}

class AsyncCat {
  async mewConcurrently (): Promise<string> {
    return 'meow! meow!'
  }
}

function sum (first: number, second: number): number {
  return first + second
}

export = {
  'play with some typescript' () {
    const dog = td.constructor(Dog)
    td.when(dog.prototype.bark()).thenReturn('woof!')

    const bird = td.object({
      fly: function (): string {
        return 'swoosh'
      }
    })
    td.when(bird.fly()).thenReturn('swoosh!')

    const fish = td.object<{
      swim(): { speed: number; direction: number };
    }>()
    td.when(fish.swim()).thenReturn({ speed: 100 })

    const kitty = td.object(['scratch', 'meow'])
    td.when(kitty.scratch()).thenReturn('scratch!')
    td.when(kitty.meow()).thenReturn('meow!')

    // eslint-disable-next-line
    if (eval("typeof Proxy") !== "undefined") {
      class Bear {
        sleep (): string {
          return 'test'
        }
      }

      const FakeBear = td.constructor<Bear>(Bear)

      assert.strictEqual(
        td.explain(FakeBear.prototype.sleep).isTestDouble,
        true
      )

      const bear = td.object<Bear>('A bear')

      td.when(bear.sleep()).thenReturn('zzzzzz')

      assert.strictEqual(bear.sleep(), 'zzzzzz')

      const instanceBear = td.instance<Bear>(Bear)
      assert.strictEqual(instanceBear instanceof Bear, true)
      assert.strictEqual(
        td.explain(instanceBear.sleep).isTestDouble,
        true
      )
    }

    const testObject = {
      funk: function () {}
    }

    td.replace(testObject, 'funk')
    td.replace(testObject, 'funk', () => 42)
    td.replace('../..')
    td.replace('../../', 42)

    const f = td.function()
    td.when(f(10)).thenReturn(10, 11)
    td.when(f(1)).thenThrow(new Error('ok'))
    td.when(f(td.matchers.isA(String))).thenDo(function (s: string) {
      return s
    })
    td.when(f(td.matchers.not(true))).thenResolve('value1', 'value2')
    td.when(f(td.matchers.not(false))).thenReject(new Error('rejected'))

    const asyncCat = td.instance(AsyncCat)
    td.when(asyncCat.mewConcurrently()).thenReturn(Promise.resolve('purr'), Promise.reject(new Error('hiss!')))

    const fakeSum = td.function(sum)
    td.when(fakeSum(1, 2)).thenReturn(3)

    const fakestSum = td.function('sum')
    td.when(fakestSum(1, 2)).thenReturn(3)

    f()
    td.verify(f())
    td.verify(f(), { times: 1 })
    td.verify(f(), { ignoreExtraArgs: false })
    td.verify(f(), { ignoreExtraArgs: true, times: 1 })

    const CatFake = td.constructor(Cat)
    const cat = new CatFake()
    td.when(cat.meow()).thenReturn('moo!')

    const explanation = td.explain(f)

    assert.strictEqual(
      explanation.description.split('\n')[0],
      'This test double has 5 stubbings and 1 invocations.'
    )
  }
};
