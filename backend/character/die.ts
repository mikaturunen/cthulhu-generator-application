"use strict";

import { random } from "./random";

export function roll(dice: Dice) {
	const throws: number[] = [];

	// NOTE if we want to throw 1d40, our random starts from 0 and yet we want to use the dice thrower as 1d40
	//      so { dice: 1, number: 40 } -> this will result into a single dice throw in th range of [0, 39], we
	//      add one to it to make it between 1-40. This works for us a bit better. We'll look into producing
	//      zeroes if we have the need for that type if dice in the future.
	for (let i = 0; i < dice.count; i++) {
		throws.push(
			random(1, dice.max)
		);
	}

	return throws.reduce((n: number, p: number) => n + p) + dice.add;
}
