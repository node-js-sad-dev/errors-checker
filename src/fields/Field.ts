import {CheckField, DefaultOptions} from '../declarations/types';

export interface IOptions<I> {
    options?: I;
}

export abstract class Field implements IOptions<DefaultOptions>{
    public readonly name: string;
    public readonly value: any;
    public readonly optional: boolean;
    public readonly options?: DefaultOptions;

    protected constructor(name: string, value: any, optional: boolean) {
        this.name = name;
        this.value = value;
        this.optional = optional;
    }

    abstract check(): CheckField;
}