// Define the array of numbers
const numbers: number[] = [1, 2, 3, 4, 5];

// Function to print a number with a simple message
function printNumber(num: number): void {
    console.log(`Number ${num}`);
}

// Alternative: use a for...of loop
for (const num of numbers) {
	printNumber(num);
}
