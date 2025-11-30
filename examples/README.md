# jspdf-autotable-rtl

**Unofficial RTL-enabled fork of [`jspdf-autotable`](https://github.com/simonbengtsson/jsPDF-AutoTable).**

This package is based on the original `jspdf-autotable` library by  
**Simon Bengtsson (MIT License)**.

The goal of this fork is to add **right-to-left (RTL) text and table support**, which is not available in the original plugin.  
All credits for the original implementation go to the original author.

---

## What’s different in this RTL fork?

- Added RTL support for table rendering  
- Fixed alignment, cell layout, and text direction issues  
- Ensured compatibility with existing jspdf-autotable APIs  

If you are not using RTL languages (Arabic, Hebrew, Persian, etc.),  
you should use the official package instead:

👉 https://www.npmjs.com/package/jspdf-autotable

---

## Original README (below)

The content below is copied from the original repository for reference.

## Examples for jspdf-autotable

### Default examples

Open `index.html` at the repository root in your browser to familiar yourself with the examples or go to the hosted [examples page](https://simonbengtsson.github.io/jsPDF-AutoTable/). Then you can check the source code of all examples in `examples.js`.

Check `simple.html` for the most basic usage example of the plugin.

### Module bundlers (browserify, webpack and requirejs)

There are three module bundler examples. If you open each example's `index.html` it should work out of the box (npm install is required for webpack and browserify). You can inspect the code used for bundling each, but it is very simple.

Note that jspdf versions before 1.3 does not work well with module bundlers.
