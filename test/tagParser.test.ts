import * as assert from 'assert'
import { parseTags } from '../src/tagParser'

suite('TagParser Tests', () => {
  suite('Reported Test Cases', () => {
    test('vue-js special syntax', () => {
      const data = '<element-tag @attr="f(x)" :special=special></element-tag>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'element-tag', start: 0, end: 43 },
          closing: { name: 'element-tag', start: 43, end: 57 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('challenging jsx syntax', () => {
      const data = `
          <Carousel
            x={isMobile ? 3>6 : 4<7}
            prevArrow={<div>{2<9}</div>}
            nextArrow={<div>{'>'}</div>}
          >
          </Carousel>
        `.trim()
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'Carousel', start: 0, end: 140 },
          closing: { name: 'Carousel', start: 151, end: 162 }
        },
        {
          attributeNestingLevel: 1,
          opening: { name: 'div', start: 70, end: 75 },
          closing: { name: 'div', start: 80, end: 86 }
        },
        {
          attributeNestingLevel: 1,
          opening: { name: 'div', start: 111, end: 116 },
          closing: { name: 'div', start: 121, end: 127 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('function as an attribute without block', () => {
      const data = `
          <cfset testArr = ['Hello', 'Hi', 'Howdy', ''] />
          <cfif ArrayLen(testArr) GT 2>
            <!--- do something --->
          </cfif>
        `.trim()
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'cfset', start: 0, end: 48 },
          closing: { name: 'cfset', start: 0, end: 48 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'cfif', start: 59, end: 88 },
          closing: { name: 'cfif', start: 135, end: 142 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
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
      `.trim()
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 5 },
          closing: { name: 'div', start: 402, end: 408 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 35, end: 40 },
          closing: { name: 'div', start: 387, end: 393 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 72, end: 121 },
          closing: { name: 'div', start: 370, end: 376 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 155, end: 172 },
          closing: { name: 'div', start: 243, end: 249 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'p', start: 203, end: 206 },
          closing: { name: 'p', start: 211, end: 215 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 264, end: 281 },
          closing: { name: 'div', start: 351, end: 357 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'p', start: 311, end: 314 },
          closing: { name: 'p', start: 319, end: 323 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('php syntax + bad formatting', () => {
      const data = `
          <div class = 'bg-warning' >
            <?php displayErrors($errors); ?>
          </div>
        `.trim()
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 27 },
          closing: { name: 'div', start: 83, end: 89 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })
  })

  suite('Basic Test Cases', () => {
    test('works with nothing passed', () => {
      const data = ''
      const expected: hmt.PartialMatch[] = []
      assert.deepEqual(parseTags(data), expected)
    })

    test('works with just > symbol', () => {
      const data = '>'
      const expected: hmt.PartialMatch[] = []
      assert.deepEqual(parseTags(data), expected)
    })

    test('ignore non tag content', () => {
      const data = 'before<div>inside</div>after'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 6, end: 11 },
          closing: { name: 'div', start: 17, end: 23 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('self closing tag', () => {
      const data = 'nonimportant<div />nonimportant'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 12, end: 19 },
          closing: { name: 'div', start: 12, end: 19 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('simple opening and closing tag', () => {
      const data = '<div>content</div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 5 },
          closing: { name: 'div', start: 12, end: 18 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('simple nested tags', () => {
      const data = '<div><span><self-closing /></span></div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 5 },
          closing: { name: 'div', start: 34, end: 40 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'span', start: 5, end: 11 },
          closing: { name: 'span', start: 27, end: 34 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'self-closing', start: 11, end: 27 },
          closing: { name: 'self-closing', start: 11, end: 27 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('simple tag with attributes', () => {
      const data = '<div attribute attribute="value">content</div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 33 },
          closing: { name: 'div', start: 40, end: 46 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('simple tag with attributes', () => {
      const data = '<div attribute attribute="value">content</div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 33 },
          closing: { name: 'div', start: 40, end: 46 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })
  })

  suite('Advanced Test Cases', () => {
    test('tag as an attribute value', () => {
      const data = '<div attribute={<span>content</span>}>content</div>'

      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 38 },
          closing: { name: 'div', start: 45, end: 51 }
        },
        {
          attributeNestingLevel: 1,
          opening: { name: 'span', start: 16, end: 22 },
          closing: { name: 'span', start: 29, end: 36 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('tag deep in the attribute value', () => {
      const data = `
        <x a={f(
          <s cmp={
            <>content<a></a></>
          }>s content</s>
        )}>x content</x>
      `.trim()

      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'x', start: 0, end: 97 },
          closing: { name: 'x', start: 106, end: 110 }
        },
        {
          attributeNestingLevel: 1,
          opening: { name: 's', start: 19, end: 72 },
          closing: { name: 's', start: 81, end: 85 }
        },
        {
          attributeNestingLevel: 2,
          opening: { name: '', start: 40, end: 42 },
          closing: { name: '', start: 56, end: 59 }
        },
        {
          attributeNestingLevel: 2,
          opening: { name: 'a', start: 49, end: 52 },
          closing: { name: 'a', start: 52, end: 56 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('React fragments', () => {
      const data = 'text<>content</>text'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: '', start: 4, end: 6 },
          closing: { name: '', start: 13, end: 16 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('unopened tag', () => {
      const data = '<a><b></c></b></a>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'a', start: 0, end: 3 },
          closing: { name: 'a', start: 14, end: 18 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'b', start: 3, end: 6 },
          closing: { name: 'b', start: 10, end: 14 }
        },
        {
          attributeNestingLevel: 0,
          closing: { name: 'c', start: 6, end: 10 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('unclosed tag', () => {
      const data = '<div><input type="button"></div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 5 },
          closing: { name: 'div', start: 26, end: 32 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'input', start: 5, end: 26 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('unclosed tag inside attribute', () => {
      const data = '<div attr={<input type="button">}></div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 34 },
          closing: { name: 'div', start: 34, end: 40 }
        },
        {
          attributeNestingLevel: 1,
          opening: { name: 'input', start: 11, end: 32 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('unopened same tag inside attribute', () => {
      const data = '<div attr={</div>}></div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 19 },
          closing: { name: 'div', start: 19, end: 25 }
        },
        {
          attributeNestingLevel: 1,
          closing: { name: 'div', start: 11, end: 17 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })

    test('unopened same tag outside as attribute', () => {
      const data = '<div><a attr={</div>}></div>'
      const expected: hmt.PartialMatch[] = [
        {
          attributeNestingLevel: 0,
          opening: { name: 'div', start: 0, end: 5 },
          closing: { name: 'div', start: 22, end: 28 }
        },
        {
          attributeNestingLevel: 0,
          opening: { name: 'a', start: 5, end: 22 }
        },
        {
          attributeNestingLevel: 1,
          closing: { name: 'div', start: 14, end: 20 }
        }
      ]
      assert.deepEqual(parseTags(data), expected)
    })
  })
})
