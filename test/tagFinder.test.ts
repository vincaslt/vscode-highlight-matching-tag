import * as assert from 'assert'
import { findMatchingTag } from '../src/tagFinder'

suite('TagMatcher Tests', () => {
  suite('Reported Test Cases', () => {
    test('vue-js special syntax', () => {
      const data = '<element-tag @attr="f(x)" :special=special></element-tag>'
      const expected = {
        opening: { name: 'element-tag', start: 0, end: 43 },
        closing: { name: 'element-tag', start: 43, end: 57 }
      }
      assert.deepEqual(findMatchingTag(data, 23), expected)
      assert.deepEqual(findMatchingTag(data, 25), expected)
      assert.deepEqual(findMatchingTag(data, 40), expected)
      assert.deepEqual(findMatchingTag(data, 46), expected)
      assert.deepEqual(findMatchingTag(data, 43), undefined)
    })

    test('challenging jsx syntax', () => {
      const data = `
        <Carousel
          x={isMobile ? 3>6 : 4<7}
          prevArrow={<div>{2<9}</div>}
          nextArrow={<div>{'>'}</div>}
        >
        </Carousel>
      `
      const expected = {
        opening: { name: 'Carousel', start: 9, end: 141 },
        closing: { name: 'Carousel', start: 150, end: 161 }
      }
      assert.deepEqual(findMatchingTag(data, 10), expected)
      assert.deepEqual(findMatchingTag(data, 44), expected)
      assert.deepEqual(findMatchingTag(data, 83), expected)
      assert.deepEqual(findMatchingTag(data, 110), expected)
      assert.deepEqual(findMatchingTag(data, 124), expected)
      assert.deepEqual(findMatchingTag(data, 154), expected)
      assert.deepEqual(findMatchingTag(data, 141), undefined)
    })

    test('function as an attribute without block', () => {
      const data = `
        <cfset testArr = ['Hello', 'Hi', 'Howdy', ''] />
        <cfif ArrayLen(testArr) GT 2>
          <!--- do something --->
        </cfif>
      `
      const expectedCfset = {
        opening: { name: 'cfset', start: 9, end: 57 },
        closing: { name: 'cfset', start: 9, end: 57 }
      }
      assert.deepEqual(findMatchingTag(data, 11), expectedCfset)
      assert.deepEqual(findMatchingTag(data, 34), expectedCfset)

      const expectedCfif = {
        opening: { name: 'cfif', start: 66, end: 95 },
        closing: { name: 'cfif', start: 138, end: 145 }
      }
      assert.deepEqual(findMatchingTag(data, 69), expectedCfif)
      assert.deepEqual(findMatchingTag(data, 84), expectedCfif)
      assert.deepEqual(findMatchingTag(data, 91), expectedCfif)
      assert.deepEqual(findMatchingTag(data, 142), expectedCfif)
      assert.deepEqual(findMatchingTag(data, 115), undefined)
    })

    test('angular syntax', () => {
      const data = `
        <div> <!-- cant find -->
          <div> <!-- cant find -->
            <div class="some-class" *ngFor="let bar of bars"> <!-- cant find -->
              <div class="foo"> <!--works!-->
                <p>Hello</p> <!--works-->
              </div>
              <div class="bar"><!--works!-->
                <p>Hello</p> <!--works-->
              </div>
            </div>
          </div>
        </div>
      `
      const expectedDiv1 = {
        opening: { name: 'div', start: 9, end: 14 },
        closing: { name: 'div', start: 411, end: 417 }
      }
      assert.deepEqual(findMatchingTag(data, 10), expectedDiv1)
      assert.deepEqual(findMatchingTag(data, 412), expectedDiv1)

      const expectedDiv2 = {
        opening: { name: 'div', start: 44, end: 49 },
        closing: { name: 'div', start: 396, end: 402 }
      }
      assert.deepEqual(findMatchingTag(data, 45), expectedDiv2)
      assert.deepEqual(findMatchingTag(data, 397), expectedDiv2)

      const expectedDiv3 = {
        opening: { name: 'div', start: 81, end: 130 },
        closing: { name: 'div', start: 379, end: 385 }
      }
      assert.deepEqual(findMatchingTag(data, 109), expectedDiv3)
      assert.deepEqual(findMatchingTag(data, 383), expectedDiv3)

      const expectedDiv4 = {
        opening: { name: 'div', start: 164, end: 181 },
        closing: { name: 'div', start: 252, end: 258 }
      }
      assert.deepEqual(findMatchingTag(data, 172), expectedDiv4)
      assert.deepEqual(findMatchingTag(data, 256), expectedDiv4)
    })

    test('php syntax + bad formatting', () => {
      const data = `
        <div class = 'bg-warning' >
          <?php displayErrors($errors); ?>
        </div>
      `
      const expected = {
        opening: { name: 'div', start: 9, end: 36 },
        closing: { name: 'div', start: 88, end: 94 }
      }
      assert.deepEqual(findMatchingTag(data, 15), expected)
      assert.deepEqual(findMatchingTag(data, 31), expected)
      assert.deepEqual(findMatchingTag(data, 92), expected)
      assert.deepEqual(findMatchingTag(data, 63), undefined)
    })
  })

  suite('Basic Test Cases', () => {
    test('ignore non tag content', () => {
      const data = 'before<div>inside</div>after'
      assert.deepEqual(findMatchingTag(data, 0), undefined)
      assert.deepEqual(findMatchingTag(data, 11), undefined)
      assert.deepEqual(findMatchingTag(data, 23), undefined)
    })

    test('self closing tag', () => {
      const data = 'nonimportant<div />nonimportant'
      const expected = {
        opening: { name: 'div', start: 12, end: 19 },
        closing: { name: 'div', start: 12, end: 19 }
      }
      assert.deepEqual(findMatchingTag(data, 13), expected)
      assert.deepEqual(findMatchingTag(data, 17), expected)
      assert.deepEqual(findMatchingTag(data, 23), undefined)
    })

    test('simple opening and closing tag', () => {
      const data = '<div>content</div>'
      const expected = {
        opening: { name: 'div', start: 0, end: 5 },
        closing: { name: 'div', start: 12, end: 18 }
      }
      assert.deepEqual(findMatchingTag(data, 1), expected)
      assert.deepEqual(findMatchingTag(data, 14), expected)
    })

    test('simple nested tags', () => {
      const data = '<div><span><self-closing /></span></div>'
      const expectedDiv = {
        opening: { name: 'div', start: 0, end: 5 },
        closing: { name: 'div', start: 34, end: 40 }
      }
      assert.deepEqual(findMatchingTag(data, 1), expectedDiv)
      assert.deepEqual(findMatchingTag(data, 37), expectedDiv)

      const expectedSpan = {
        opening: { name: 'span', start: 5, end: 11 },
        closing: { name: 'span', start: 27, end: 34 }
      }
      assert.deepEqual(findMatchingTag(data, 7), expectedSpan)
      assert.deepEqual(findMatchingTag(data, 31), expectedSpan)

      const expectedSelfClosing = {
        opening: { name: 'self-closing', start: 11, end: 27 },
        closing: { name: 'self-closing', start: 11, end: 27 }
      }
      assert.deepEqual(findMatchingTag(data, 20), expectedSelfClosing)
    })

    test('simple tag with attributes', () => {
      const data = '<div attribute attribute="value">content</div>'
      const expected = {
        opening: { name: 'div', start: 0, end: 33 },
        closing: { name: 'div', start: 40, end: 46 }
      }
      assert.deepEqual(findMatchingTag(data, 18), expected)
    })

    test('simple tag with attributes', () => {
      const data = '<div attribute attribute="value">content</div>'
      const expected = {
        opening: { name: 'div', start: 0, end: 33 },
        closing: { name: 'div', start: 40, end: 46 }
      }
      assert.deepEqual(findMatchingTag(data, 18), expected)
    })
  })

  suite('Advanced Test Cases', () => {
    test('tag as an attribute value', () => {
      const data = '<div attribute={<span>content</span>}>content</div>'
      const expectedOutside = {
        opening: { name: 'div', start: 0, end: 38 },
        closing: { name: 'div', start: 45, end: 51 }
      }
      assert.deepEqual(findMatchingTag(data, 1), expectedOutside)
      assert.deepEqual(findMatchingTag(data, 24), expectedOutside)
      assert.deepEqual(findMatchingTag(data, 48), expectedOutside)

      const expectedInside = {
        opening: { name: 'span', start: 16, end: 22 },
        closing: { name: 'span', start: 29, end: 36 }
      }
      assert.deepEqual(findMatchingTag(data, 18), expectedInside)
      assert.deepEqual(findMatchingTag(data, 31), expectedInside)
    })

    test('tag deep in the attribute value', () => {
      const data = `
        <x a={f(
          <s cmp={
            <>content<a></a></>
          }>s content</s>
        )}>x content</x>`

      const expectedX = {
        opening: { name: 'x', start: 9, end: 106 },
        closing: { name: 'x', start: 115, end: 119 }
      }
      assert.deepEqual(findMatchingTag(data, 10), expectedX)
      assert.deepEqual(findMatchingTag(data, 17), expectedX)
      assert.deepEqual(findMatchingTag(data, 86), expectedX)
      assert.deepEqual(findMatchingTag(data, 105), expectedX)
      assert.deepEqual(findMatchingTag(data, 117), expectedX)

      const expectedS = {
        opening: { name: 's', start: 28, end: 81 },
        closing: { name: 's', start: 90, end: 94 }
      }
      assert.deepEqual(findMatchingTag(data, 30), expectedS)
      assert.deepEqual(findMatchingTag(data, 54), expectedS)
      assert.deepEqual(findMatchingTag(data, 61), expectedS)
      assert.deepEqual(findMatchingTag(data, 92), expectedS)

      const expectedFragment = {
        opening: { name: '', start: 49, end: 51 },
        closing: { name: '', start: 65, end: 68 }
      }
      assert.deepEqual(findMatchingTag(data, 50), expectedFragment)
      assert.deepEqual(findMatchingTag(data, 67), expectedFragment)

      const expectedA = {
        opening: { name: 'a', start: 58, end: 61 },
        closing: { name: 'a', start: 61, end: 65 }
      }
      assert.deepEqual(findMatchingTag(data, 59), expectedA)
      assert.deepEqual(findMatchingTag(data, 62), expectedA)
    })

    test('React fragments', () => {
      const data = 'text<>content</>text'
      const expected = {
        opening: { name: '', start: 4, end: 6 },
        closing: { name: '', start: 13, end: 16 }
      }
      assert.deepEqual(findMatchingTag(data, 5), expected)
      assert.deepEqual(findMatchingTag(data, 14), expected)
      assert.deepEqual(findMatchingTag(data, 15), expected)
    })
  })
})
