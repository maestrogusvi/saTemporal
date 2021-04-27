import { IRequiredProperties } from './meta.interface';

export class MetaProperties {

    private delimiter: string;
    private escapeChar: string;
    private escapeDisabled: string;
    private skipHeaderRecord: string;
    private ignoreEmptyLines: string;
    private quote: string;
    private quoteDisabled: string;

    constructor() {
        this.delimiter = null;
        this.escapeChar = '\\';
        this.escapeDisabled = null;
        this.skipHeaderRecord = null;
        this.ignoreEmptyLines = null;
        this.quote = '\"';
        this.quoteDisabled = null;
    }

    get(): IRequiredProperties {
        return {
            delimiter: this.delimiter,
            escapeChar: this.escapeChar,
            escapeDisabled: this.escapeDisabled,
            skipHeaderRecord: this.skipHeaderRecord,
            ignoreEmptyLines: this.ignoreEmptyLines,
            quote: this.quote,
            quoteDisabled: this.quoteDisabled
        };
    }

    set<T extends IRequiredProperties>({ ...options }: T): void {
        this.delimiter = options.delimiter ? `${options.delimiter}` : null;
        this.escapeChar = this.getEscapeChar(options.escapeChar);
        this.escapeDisabled = options.escapeDisabled ? `${options.escapeDisabled}` : null;
        this.skipHeaderRecord = options.skipHeaderRecord ? `${options.skipHeaderRecord}` : null;
        this.ignoreEmptyLines = options.ignoreEmptyLines ? `${options.ignoreEmptyLines}` : null;
        this.quote = options.quote ? `${options.quote}` : `\"`;
        this.quoteDisabled = options.quoteDisabled ? `${options.quoteDisabled}` : null;
    }

    private getEscapeChar(escapeChar): string {
        const charArray = ['t', 'b', 'n', 'r', 'f', '\'', '"', '\\'];
        if (charArray.includes(escapeChar)) {
            return `${escapeChar}`;
        }
        return escapeChar ? `${escapeChar}` : `\\`;
    }
}
