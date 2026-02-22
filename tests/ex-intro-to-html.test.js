// FIX: Add a polyfill for TextEncoder and TextDecoder for older Node.js versions
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// --- End of FIX ---

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// --- Configuration ---
// The test will look for the student's file with this name in the parent directory.
const studentHtmlFileName = '../index.html'; 
// --- End Configuration ---

const htmlPath = path.join(__dirname, studentHtmlFileName);

// First, check if the file exists. Jest will handle this gracefully.
if (!fs.existsSync(htmlPath)) {
  describe('HTML File Check', () => {
    test(`The file '${studentHtmlFileName}' should exist`, () => {
      // This test will fail and provide a clear message.
      expect(fs.existsSync(htmlPath)).toBe(true);
    });
  });
} else {
  // Read the HTML file content
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const { document } = dom.window;

  describe('HTML Structure and Content Validation', () => {
    
    // Test for <head> elements
    describe('Document Head <head>', () => {
      test('should have a lang attribute on the <html> tag', () => {
        const lang = document.documentElement.getAttribute('lang');
        expect(lang).not.toBeNull();
        expect(lang).not.toBe('');
      });
      
      test('should have a <meta> tag for UTF-8 charset', () => {
        const metaCharset = document.querySelector('meta[charset]');
        expect(metaCharset).not.toBeNull();
      });

      test('should have a <meta> tag for viewport', () => {
        const metaViewport = document.querySelector('meta[name="viewport"]');
        expect(metaViewport).not.toBeNull();
      });

      test('should have a non-empty <title> tag', () => {
        expect(document.title).not.toBe('');
      });
    });

    // Test for <body> elements
    describe('Document Body <body>', () => {
      test('should contain exactly one <h1> heading with text content', () => {
        const h1s = document.querySelectorAll('h1');
        expect(h1s.length).toBe(1);
        expect(h1s[0].textContent.trim()).not.toBe('');
      });
      
      test('should contain an <hr> tag', () => {
        const hr = document.querySelector('hr');
        expect(hr).not.toBeNull();
      });

      test('should contain at least two <h2> headings', () => {
        const h2s = document.querySelectorAll('h2');
        expect(h2s.length).toBeGreaterThanOrEqual(2);
      });

      test('should have an introduction <p> tag directly inside the body', () => {
        const introP = document.querySelector('body > p');
        expect(introP).not.toBeNull();
        expect(introP.textContent.trim()).not.toBe('');
      });
    });
    
    // Test for the list of hobbies
    describe('Hobbies List', () => {
      test('should have a <ul> tag', () => {
        const ul = document.querySelector('ul');
        expect(ul).not.toBeNull();
      });
      
      test('the <ul> should contain at least 3 <li> items', () => {
        const listItems = document.querySelectorAll('ul > li');
        expect(listItems.length).toBeGreaterThanOrEqual(3);
      });
    });

    // Test for the blockquote
    describe('Favorite Quote Section', () => {
      test('should have a <blockquote> tag', () => {
        const blockquote = document.querySelector('blockquote');
        expect(blockquote).not.toBeNull();
      });
      
      test('the <blockquote> should contain a <p> tag for the quote text', () => {
        const quoteP = document.querySelector('blockquote > p');
        expect(quoteP).not.toBeNull();
      });
      
      test('the <blockquote> should contain a <cite> tag for the author', () => {
        const cite = document.querySelector('blockquote > cite');
        expect(cite).not.toBeNull();
      });
    });
    
    // Test for the hyperlink
    describe('Hyperlink', () => {
        test('should have an <a> tag with a valid href attribute', () => {
            const link = document.querySelector('a');
            expect(link).not.toBeNull();
            const href = link.getAttribute('href');
            expect(href).not.toBeNull();
            expect(href.trim()).not.toBe('');
            expect(href.trim()).not.toBe('#');
        });
    });
    
    // Bonus test for the image
    describe('BONUS: Image', () => {
        test('should have an <img> tag with both src and alt attributes', () => {
            const img = document.querySelector('img');
            // If there's no image, this bonus test can just pass.
            if (img) {
                const src = img.getAttribute('src');
                const alt = img.getAttribute('alt');
                expect(src).not.toBeNull();
                expect(src.trim()).not.toBe('');
                expect(alt).not.toBeNull(); // alt can be empty, but must be present
            } else {
              // This structure makes the test informational rather than a strict failure
              // if the bonus is not attempted.
              console.log('Bonus <img> tag not found. Skipping test.');
              expect(true).toBe(true);
            }
        });
    });

  });
}
