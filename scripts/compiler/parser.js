import { TT, Exception, Result } from "./helper.js";

class InvalidSyntax extends Exception {
	constructor(startPos, endPos, details) {
		super(startPos, endPos, "Invalid Syntax", details);
	}
}

class IntLiteral {
	constructor(startPos, endPos, value) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.value = value;
	}
}

class FloatLiteral {
	constructor(startPos, endPos, value) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.value = value;
	}
}

class BinaryOpNode {
	constructor(startPos, endPos, left, op, right) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.left = left;
		this.op = op;
		this.right = right;
	}
}

class UnaryOpNode {
	constructor(startPos, endPos, op, value) {
		this.startPos = startPos;
		this.endPos = endPos;
		this.op = op;
		this.value = value;
	}
}

export function parse(tokens) {
	let pos = -1;
	let currentTok;

	function advance() {
		pos++;
		if (pos < tokens.length) currentTok = tokens[pos];
	}
	advance();
	const res = new Result();

	while (currentTok.type !== TT.EOF) {
		return expr();
	}

	function binaryOp(ops, fLeft, fRight = undefined) {
		if (!fRight) fRight = fLeft;
		const res = new Result();

		let left = res.register(fLeft());
		if (res.error) return res;

		while (currentTok.type === TT.OP && ops.includes(currentTok.value)) {
			const op = currentTok;
			advance();

			const right = res.register(fRight());
			if (res.error) return res;

			left = new BinaryOpNode(
				left.startPos,
				right.endPos,
				left,
				op,
				right,
			);
		}

		return res.success(left);
	}

	function expr() {
		return additive();
	}

	function additive() {
		return binaryOp(["+", "-"], multiplicative);
	}

	function multiplicative() {
		return binaryOp(["*", "/", "%"], unary);
	}

	function unary() {
		const res = new Result();

		if (currentTok.type === TT.OP && "+-".includes(currentTok.value)) {
			const op = currentTok;
			advance();

			const value = res.register(unary());
			if (res.error) return res;

			return res.success(
				new UnaryOpNode(op.startPos, value.endPos, op, value),
			);
		}
		return literal();
	}

	function literal() {
		const res = new Result();
		const tok = currentTok;
		advance();

		if (tok.type === TT.INT)
			return res.success(
				new IntLiteral(tok.startPos, tok.endPos, tok.value),
			);
		if (tok.type === TT.FLOAT)
			return res.success(
				new FloatLiteral(tok.startPos, tok.endPos, tok.value),
			);
		if (tok.type === TT.LPAREN) {
			const expression = res.register(expr());
			if (res.error) return res;

			if (currentTok.type !== TT.RPAREN)
				return res.success(
					new InvalidSyntax(
						currentTok.startPos,
						currentTok.endPos,
						"Expected matching ')'.",
					),
				);
			advance();
			return res.success(expression);
		}

		return res.fail(
			new InvalidSyntax(
				tok.startPos,
				tok.endPos,
				`Unrecognized token: ${tok.type.description}`,
			),
		);
	}
}
