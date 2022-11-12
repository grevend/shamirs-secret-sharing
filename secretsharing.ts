/*
 * Copyright (c) 2022 - for information on the respective copyright owner
 * see the NOTICE file and/or the repository https://github.com/grevend/shamirs-secret-sharing.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const libSuffix = {"windows": "dll", "darwin": "dylib"}[Deno.build.os] || "so"
const libName = `./native/libsecretsharing.${libSuffix}`;
const dylib = Deno.dlopen(
    libName,
    {
        "shares__bridge__auto": { parameters: ["usize", "buffer", "usize", "usize"], result: "pointer" },
        "reconstruct": { parameters: ["usize", "usize", "buffer"], result: "pointer" }
    } as const,
);

function shareSecret(secret: Int8Array, shares: number, threshold: number): Int8Array[] {
    if(secret.length < 1) throw 'check secret is not empty';
    if(shares < 2) throw 'at least two shares';
    if(threshold > shares) throw 'check shares compared to threshold';
    const ptr = dylib.symbols.shares__bridge__auto(secret.length, secret, shares, threshold);
    const buffer = new Int8Array(new Deno.UnsafePointerView(ptr).getArrayBuffer((secret.length + 1) * shares));
    const _shares: Int8Array[] = [];

    for(let i = 0; i < shares; i++) {
        _shares.push(buffer.subarray((secret.length + 1) * i, ((secret.length + 1) * i) + 5));
    }

    return _shares;
}

function reconstructSecret(shares: Int8Array[]): Int8Array {
    if(shares.length < 2) throw 'check that the shares are not empty';
    if(!shares.every(arr => arr.length === shares[0].length)) throw 'check that all arrays have an equal length';
    const merged = shares.reduce((prev, curr) => Int8Array.from([...prev, ...curr]), Int8Array.of())
    const ptr = dylib.symbols.reconstruct(shares.length, shares[0].length, merged);
    return new Int8Array(new Deno.UnsafePointerView(ptr).getArrayBuffer(shares[0].length - 1));
}