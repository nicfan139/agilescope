export const omit = (object: { [k: string]: any }, exclude: string[]) =>
	Object.fromEntries(Object.entries(object).filter((e) => !exclude.includes(e[0])));
