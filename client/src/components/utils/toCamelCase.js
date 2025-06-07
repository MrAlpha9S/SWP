const toCamelCase = (obj) =>
    Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key.replace(/_([a-z])/g, (_, char) => char.toUpperCase()),
            value,
        ])
    );

export default toCamelCase;
