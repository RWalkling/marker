export default class Marker {
    private signature: symbol;

    public constructor(description: string) {
        this.signature = Symbol(description || 'Descriptionless Mark');
    }

    public mark<T>(object: T, value: unknown = undefined): T {
        if (typeof object !== 'object') throw TypeError(`Can only mark objects, not ${object}`);
        if (object === null) throw TypeError('Cannot mark null');

        return Object.defineProperty(object, this.signature, { value });
    }

    public marked(object: object): boolean {
        return (
            typeof object === 'object' &&
            object !== null &&
            Object.prototype.hasOwnProperty.call(object, this.signature)
        );
    }

    private getValueUnsafe<TExpected>(object: object): TExpected {
        return Object.getOwnPropertyDescriptor(object, this.signature)!.value;
    }

    public maybeMap<TExpected, TReturn, TOtherwise = undefined>(
        func: (value: TExpected) => TReturn,
        object: object,
        otherwise?: TOtherwise,
    ): TReturn | TOtherwise {
        return this.marked(object) ? func(this.getValueUnsafe<TExpected>(object)) : otherwise!;
    }

    public value<TExpected, TOtherwise = undefined>(object: object, otherwise?: TOtherwise): TExpected | TOtherwise {
        return this.maybeMap((value: TExpected) => value, object, otherwise!);
    }
}
