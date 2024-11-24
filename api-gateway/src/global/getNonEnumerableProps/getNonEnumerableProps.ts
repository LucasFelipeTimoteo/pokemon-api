export const getNonEnumerableProps = (obj: object) => {
	return Object.fromEntries(
		Object.entries(Object.getOwnPropertyDescriptors(obj)).map(
			([key, descriptor]) => [key, descriptor.value],
		),
	);
};
