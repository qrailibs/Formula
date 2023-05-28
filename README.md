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

# Usage
Install a Formula CLI firstly:
```bash
npm i formula-cli --scope=global
```

After installation you can use CLI to compile formula file:
```bash
formula compile example.formula
```

And also you can compile the whole directory:
```bash
formula compile src --dir
```

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