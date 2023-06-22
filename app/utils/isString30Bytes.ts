export function isString30Bytes(str: string): boolean {
    const buffer = Buffer.from(str, 'utf8');
    return buffer.byteLength >= 30;
}