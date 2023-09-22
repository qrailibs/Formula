# Formula
Simple language for describing data formats, transpilable to RegExp.

# Syntax
Example of advanced formula:
```formula
# Variables
define VAL match '[a-f0-9]'
define VAL_3 match(3) VAL
define VAL_6 match(6) VAL

# Tests
test '#fff'
test '#ababab'
test '#000000'
test '#f0f0f0'

# Formula
match START
match '#'
group {
	match VAL_3 | VAL_6 # 3 or 6 hex values
}
match END
```

Formula is gonna be transpiled into following RegExp:
```regex
^#((?:[a-f0-9]{3})|(?:[a-f0-9]{6}))$
```

# Usage
Install a Formula CLI globally:
```bash
npm i formula-cli -g
```

After installation you can use CLI to compile formula file:
```bash
formula compile example.formula
```

And also you can compile the whole directory:
```bash
formula compile src --dir
```

For running a tests inside formula:
```bash
formula test example.formula
```

# Examples
You can see examples of formulas in [`/example`](https://github.com/datasco/Formula/tree/main/examples) directory in this repository.

# Changelog

## v2.1
- Fixed infinite loop when `#` at the end of file

## v2.0
- Added testing system that allows to test formulas matching
- Added `formula test` CLI command
- Added `test`

## v1.1
- Added support of both string formats (`'` and `"`)
- Added support of `+`/`(min,max)` and  `?` to groups
- Added `|` operator for matching
- Fixed if-else compilation

## v1.0
- Added `formula compile` CLI command
- Added `match`
- Added `group`
- Added `if` and `else`
- Added `define`