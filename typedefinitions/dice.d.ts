
/**
 * Dice throw model.
 *
 * Describes a single throw of set of dices. Given 2d6+1 we would roll two dice (count: 2),
 * with six faces (max: 6) and adding one on top of the dice rolls (add: 1).
 */
interface Dice {
	/**
	* How many die are being thrown.
	* For example: 2d6+1 -> count: 2.
	*/
	count: number;

	/**
	* The max value of the die, or faces.
	* For example: 2d6+1 -> max: 6.
	*/
	max: number;

	/**
	* What value gets added to the die total.
	* For example: 2d6+1 -> add: 1.
	*/
	add: number;
}
