// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.4;

library IntegralMath {
    /**
      * @dev Compute the nearest integer to the quotient of `n / d`
    */
    function roundDiv(uint256 n, uint256 d) internal pure returns (uint256) { unchecked {
        return n / d + (n % d) / (d - d / 2);
    }}

    /**
      * @dev Compute the largest integer smaller than or equal to the binary logarithm of `n`
    */
    function floorLog2(uint256 n) internal pure returns (uint8) { unchecked {
        uint8 res = 0;

        if (n < 256) {
            // at most 8 iterations
            while (n > 1) {
                n >>= 1;
                res += 1;
            }
        }
        else {
            // exactly 8 iterations
            for (uint8 s = 128; s > 0; s >>= 1) {
                if (n >= 1 << s) {
                    n >>= s;
                    res |= s;
                }
            }
        }

        return res;
    }}

    /**
      * @dev Compute the largest integer smaller than or equal to the square root of `n`
    */
    function floorSqrt(uint256 n) internal pure returns (uint256) { unchecked {
        if (n > 0) {
            uint256 x = n / 2 + 1;
            uint256 y = (x + n / x) / 2;
            while (x > y) {
                x = y;
                y = (x + n / x) / 2;
            }
            return x;
        }
        return 0;
    }}

    /**
      * @dev Compute the smallest integer larger than or equal to the square root of `n`
    */
    function ceilSqrt(uint256 n) internal pure returns (uint256) { unchecked {
        uint256 x = floorSqrt(n);
        return x * x == n ? x : x + 1;
    }}
}