const IntegralMath = artifacts.require("IntegralMathUser");

const assertRevert = require("./helpers/Utilities.js").assertRevert;

const Decimal = require("decimal.js");

const MAX_UINT256 = Decimal(2).pow(256).sub(1);

const roundDiv  = (n, d) => n.div(d).add(0.5).floor();
const floorLog2 = (n) => n.log(2).floor();
const floorSqrt = (n) => n.sqrt().floor();
const ceilSqrt  = (n) => n.sqrt().ceil();
const mulDivF   = (x, y, z) => x.mul(y).div(z).floor();
const mulDivC   = (x, y, z) => x.mul(y).div(z).ceil();

contract("IntegralMath", () => {
    let integralMath;

    before(async () => {
        integralMath = await IntegralMath.new();
    });

    for (let i = 0; i < 10; i++) {
        const x = Decimal(2).pow(256).sub(i + 1).toHex();
        for (let j = 1; j <= 10; j++) {
            const y = Decimal(2).pow(256).sub(j).toHex();
            for (const [n, d] of [[i, j], [x, j], [i, y], [x, y]]) {
                test(roundDiv, n, d);
            }
        }
    }

    for (let n = 1; n <= 256; n++) {
        for (const k of n < 256 ? [-1, 0, +1] : [-1]) {
            test(floorLog2, Decimal(2).pow(n).add(k).toHex());
        }
    }

    for (let n = 1; n <= 256; n++) {
        for (const k of n < 256 ? [-1, 0, +1] : [-1]) {
            test(floorSqrt, Decimal(2).pow(n).add(k).toHex());
        }
    }

    for (let n = 1; n <= 256; n++) {
        for (const k of n < 256 ? [-1, 0, +1] : [-1]) {
            test(ceilSqrt, Decimal(2).pow(n).add(k).toHex());
        }
    }

    for (const method of [mulDivF, mulDivC]) {
        for (const px of [0, 64, 128, 192, 255, 256]) {
            for (const py of [0, 64, 128, 192, 255, 256]) {
                for (const pz of [1, 64, 128, 192, 255, 256]) {
                    for (const ax of px < 256 ? [-1, 0, +1] : [-1]) {
                        for (const ay of py < 256 ? [-1, 0, +1] : [-1]) {
                            for (const az of pz < 256 ? [-1, 0, +1] : [-1]) {
                                const x = Decimal(2).pow(px).add(ax);
                                const y = Decimal(2).pow(py).add(ay);
                                const z = Decimal(2).pow(pz).add(az);
                                test(method, x.toHex(), y.toHex(), z.toHex());
                            }
                        }
                    }
                }
            }
        }
    }

    for (const method of [mulDivF, mulDivC]) {
        for (const px of [64, 128, 192, 256]) {
            for (const py of [64, 128, 192, 256]) {
                for (const pz of [64, 128, 192, 256]) {
                    for (const ax of [px >> 1, 0]) {
                        for (const ay of [py >> 1, 0]) {
                            for (const az of [pz >> 1, 0]) {
                                const x = Decimal(2).pow(px).sub(Decimal(2).pow(ax));
                                const y = Decimal(2).pow(py).sub(Decimal(2).pow(ay));
                                const z = Decimal(2).pow(pz).sub(Decimal(2).pow(az));
                                test(method, x.toHex(), y.toHex(), z.toHex());
                            }
                        }
                    }
                }
            }
        }
    }

    function test(method, ...args) {
        it(`${method.name}(${args.join(", ")})`, async () => {
            const expected = method(...args.map(x => Decimal(x)));
            if (expected.lte(MAX_UINT256)) {
                const actual = await integralMath[method.name](...args);
                assert(expected.eq(actual.toString()), `expected ${expected.toFixed()} but got ${actual.toString()}`);
            }
            else {
                await assertRevert(integralMath[method.name](...args), "");
            }
        });
    }
});
