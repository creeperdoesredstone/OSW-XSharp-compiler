const tokenTypes = [
	"EOF",
	"SEMI",
	"INT",
	"FLOAT",
	"STRING",
	"IDENT",
	"KEYW",
	"OP",
	"LPAREN",
	"RPAREN",
];

export const TT = {};
for (const type of tokenTypes) {
	TT[type] = Symbol(type);
}
Object.freeze(TT);

export class Position {
	constructor(idx, ln, col, fn, ftxt) {
		this.idx = idx;
		this.ln = ln;
		this.col = col;
		this.fn = fn;
		this.ftxt = ftxt;
	}

	advance(currentChar) {
		this.idx++;
		this.col++;
		if (currentChar === "\n") {
			this.col = 0;
			this.ln++;
		}
	}

	copy() {
		return new Position(this.idx, this.ln, this.col, this.fn, this.ftxt);
	}
}

export class Result {
	constructor() {
		this.value = null;
		this.error = null;
	}

	register(res) {
		if (res.error) this.error = res.error;
		return res.value;
	}

	success(value) {
		this.value = value;
		return this;
	}

	fail(error) {
		this.error = error;
		return this;
	}
}

export class Token {
	constructor(startPos, endPos, type, value) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.type = type;
		this.value = value;
	}
}

export class Exception {
	constructor(startPos, endPos, name, details) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.name = name;
		this.details = details;
	}

	toString() {
		let res = "";

		if (this.startPos) {
			res += `File ${this.startPos.fn}, line ${this.startPos.ln} column ${this.startPos.col}\n\n`;
		}

		res += `${this.name}: ${this.details}`;

		return res;
	}
}
