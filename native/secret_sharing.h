/*
 * Copyright (c) 2022 - for information on the respective copyright owner
 * see the NOTICE file and/or the repository https://github.com/grevend/shamirs-secret-sharing.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

#ifndef SECRET_SHARING_H
#define SECRET_SHARING_H

#include <stdlib.h>
#include <stdint.h>

#define SRAND (srand((unsigned int)time(NULL)))

#define NEAREST(bytes, multiple) ((bytes + multiple - 1) & ~(multiple - 1))
#define UINT(x) (((int)x) & 0xff)

#define ADD(l, r) (l ^ r)
#define SUB(l, r) (l ^ r)

typedef char *(*rand_gen)(size_t);

#ifdef __x86_64__
int _arch_rdrand_support();
#endif
char *_rand_bytes_economical(size_t len);
#ifdef __x86_64__
char *_rand_bytes_real_random(size_t len);
#endif
char *_rand_bytes(size_t len);
char _mul(char l, char r);
char _div(char l, char r);

unsigned int _degree(size_t polyc, char *polyv);
char *_poly(rand_gen gen, int degree, char x);
char _eval(size_t polyc, char *polyv, char x);
char *shares(size_t secretc, char *secretv, rand_gen gen, size_t n, size_t k);
char _interpolate(size_t pointc, char *pointsv);
char *reconstruct(size_t partc, size_t polyc, char *partv);

#endif /* SECRET_SHARING_H */
