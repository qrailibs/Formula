enum TokenType {
	Unknown = 'unknown',

	// ?
	Optional = '?',
	// +
	Mutiple = '+',

	// group
	Group = 'group',
	// {
	GroupStart = '{',
	// }
	GroupEnd = '}',
	// !
	Anonymous = '!',

	// (
	ArgStart = '(',
	// ,
	Comma = ',',
	// )
	ArgEnd = ')',

	// ...
	Pseudo = '...',

	// |
	Or = '|',
	// &
	And = '&',

	// match
	Match = 'match',

	// if
	If = 'if',
	// else
	Else = 'else',

	// define
	Define = 'define',
	// test
	Test = 'test',

	// Name
	Name = 'name',

	// Text
	LiteralString = 'literal_string',
	// Number
	LiteralNumber = 'literal_number'
}

export default TokenType;