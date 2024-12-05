function appendToDisplay(value) {
    const display = document.getElementById("display");
    display.value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function deleteLast() {
    const display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    const display = document.getElementById("display");
    try {
        const result = evaluateExpression(display.value);
        display.value = result;
    } catch (error) {
        display.value = "Error";
    }
}

function evaluateExpression(expression) {
    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "**": (a, b) => a ** b,
    };

    const tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\*{1,2}|\/|\(|\))/g);
    if (!tokens) throw new Error("Invalid Expression");

    const values = [];
    const ops = [];

    const applyOperator = () => {
        const b = values.pop();
        const a = values.pop();
        const op = ops.pop();
        values.push(operators[op](a, b));
    };

    for (const token of tokens) {
        if (!isNaN(token)) {
            values.push(parseFloat(token));
        } else if (token in operators) {
            while (
                ops.length &&
                precedence(ops[ops.length - 1]) >= precedence(token)
            ) {
                applyOperator();
            }
            ops.push(token);
        } else if (token === "(") {
            ops.push(token);
        } else if (token === ")") {
            while (ops[ops.length - 1] !== "(") {
                applyOperator();
            }
            ops.pop();
        }
    }

    while (ops.length) {
        applyOperator();
    }

    return values.pop();
}

function precedence(op) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/" || op === "**") return 2;
    return 0;
}
