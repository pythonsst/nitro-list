/** * CellType is just a string, but we give it a name 
 * so the code is easier to read. 
 */
export type CellType = string;

/** * This is an "Identity" function. It doesn't do anything 
 * to the computer, but it helps the human reading the code.
 */
export const cellType = (name: string): CellType => name;