# Formula
Simple language for describing data formats, compilable to Regex

# Basic example
```formula
match+ 'A'
```
Compiled into regex:
```regex
A+
```

# Progress
- [X] `match` Statements
- [X] `group` Statements
- [X] `if` and `else` Statements
- [X] `define` Statements

# Changelog

## v1.1
- Added support of both string formats (`'` and `"`)
- Added support of `+`/`(min,max)` and  `?` to groups
- Added `|` operator for matching
- Fixed if-else compilation

## v1.0
- Added `match`
- Added `group`
- Added `if` and `else`
- Added `define`