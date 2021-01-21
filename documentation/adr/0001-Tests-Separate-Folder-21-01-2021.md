# Tests live in separate folder

* Status: accepted

## Context and Problem Statement
Tests are useful during development, but serve no purpose during deployment. On the one hand, keeping the tests located close to the code makes life easy during development and encourages writing tests. On the other hand, deploying tests increases the package size with no benefit. 

## Considered Options

* Side-by-Side: For a code file X.ts, place the test file in the same folder, e.g. X.spec.ts
* Separate folder: For a code file X.ts, place the test file in a dedicated test folder, which is a top-level folder like src.

## Decision Outcome
Tests are placed in a separate folder as npm offers no viable configuration options to exclude those test files. Given the current size of the project, searching for something viable isn't worth the effort.
