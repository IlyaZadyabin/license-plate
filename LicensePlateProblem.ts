/**
 * You work for the DMV; you have a specific, sequential way of generating new license plate numbers:
 *
 * Each license plate number has 6 alphanumeric characters. The numbers always come before the letters.
 *
 * The first plate number is 000000, followed by 000001... 
 * When you arrive at 999999, the next entry would be 00000A, Followed by 00001A... 
 * When you arrive at 99999A, the next entry is 00000B, Followed by 00001B...
 * After following the pattern to 99999Z, the next in the sequence would be 0000AA...
 *
 * When 9999AA is reached, the next in the series would be 0000AB...0001AB
 * When 9999AB is reached, the next in the series would be 0000AC...0001AC
 * When 9999AZ is reached, the next in the series would be 0000BA...0001BA
 * When 9999ZZ is reached, the next in the series would be 000AAA...001AAA
 *
 * And so on untill the sequence completes with ZZZZZZ.
 *
 * So the pattern overview looks a bit like this:
 *
 * 000000
 * 000001
 * ...
 * 999999
 * 00000A
 * 00001A
 * ...
 * 99999A
 * 00000B
 * 00001B
 * ...
 * 99999Z
 * 0000AA
 * 0001AA
 * ...
 * 9999AA
 * 0000AB
 * 0001AB
 * ...
 * 9999AB
 * 0000AC
 * 0001AC
 * ...
 * 9999AZ
 * 0000BA
 * 0001BA
 * ...
 * 9999BZ
 * 0000CA
 * 0001CA
 * ...
 * 9999ZZ
 * 000AAA
 * 001AAA
 * ...
 * 999AAA
 * 000AAB
 * 001AAB
 * ...
 * 999AAZ
 * 000ABA
 * ...
 * ZZZZZZ
 *
 *
 * The goal is to write the most efficient function that can return the nth element in this sequence.
 * */

const englishAlphabetSize = 26;

function getNthLicencePlate(n: number): string {
    // Define groups: {lettersCount, size}
    // Group i has (6 - i) digits and i letters
    // Size = 10^(6-i) * 26^i
    const groups: Array<{ letters: number; size: number }> = [];

    for (let letterCount = 0; letterCount <= 6; letterCount++) {
        const digitCount = 6 - letterCount;
        const size = Math.pow(10, digitCount) * Math.pow(englishAlphabetSize, letterCount);
        groups.push({ letters: letterCount, size });
    }

    // Find which group n belongs to
    let sumBeforeGroup = 0;
    let groupIndex = 0;

    for (let i = 0; i < groups.length; i++) {
        if (n < sumBeforeGroup + groups[i].size) {
            groupIndex = i;
            break;
        }
        sumBeforeGroup += groups[i].size;
    }

    const group = groups[groupIndex];
    const positionInGroup = n - sumBeforeGroup;
    const letterCount = group.letters;
    const digitCount = 6 - letterCount;

    const numberCombinations = Math.pow(10, digitCount);
    const letterPartIndex = Math.floor(positionInGroup / numberCombinations);
    const numberPart = positionInGroup % numberCombinations;

    const numberStr = digitCount > 0 ? numberPart.toString().padStart(digitCount, '0') : '';

    let letterStr = '';
    if (letterCount > 0) {
        let remaining = letterPartIndex;
        for (let i = 0; i < letterCount; i++) {
            letterStr = String.fromCharCode('A'.charCodeAt(0) + (remaining % englishAlphabetSize)) + letterStr;
            remaining = Math.floor(remaining / englishAlphabetSize);
        }
    }

    return numberStr + letterStr;
}

// Test cases
console.log(getNthLicencePlate(0));         // 000000
console.log(getNthLicencePlate(1));         // 000001
console.log(getNthLicencePlate(999999));    // 999999
console.log(getNthLicencePlate(1000000));   // 00000A
console.log(getNthLicencePlate(1000001));   // 00001A
console.log(getNthLicencePlate(1099999));   // 99999A
console.log(getNthLicencePlate(1100000));   // 00000B
console.log(getNthLicencePlate(3599999));   // 99999Z
console.log(getNthLicencePlate(3600000));   // 0000AA
console.log(getNthLicencePlate(3600001));   // 0001AA
console.log(getNthLicencePlate(3610000));   // 0000AB
console.log(getNthLicencePlate(10359999));  // 9999ZZ
console.log(getNthLicencePlate(10360000));  // 000AAA