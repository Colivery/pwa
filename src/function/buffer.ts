export const buffer = (instance: { lookupTimeout: any }, fn: Function, buffer: number = 500): Function => {
    return () => {
        return new Promise((resolve => {
            clearTimeout(instance.lookupTimeout);
            instance.lookupTimeout = setTimeout(() => {
                fn(resolve)
            }, buffer);
        }))
    };
};
