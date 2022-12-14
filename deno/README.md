# Shamir’s Secret-Sharing Scheme

A preponderance of the open-source Shamir’s Secret-Sharing Scheme
implementations operate on a finite field $\mathbb{F}_q$, where $q$ is dependent
on both the secret size as well as the number of shares, thus requiring both the
search for a sufficiently large prime as well as the support of a large enough
number representation or chunking of the secret. This implementation outlines an
optimized low-level c and inline assembly-based alternative that uses the Galois
field $2^8$, referred to as GF(256), along with a Reed-Solomon inspired encoding
approach and a hardware-accelerated entropy sourced secure number generator to
offer the theoretical capacity to process secrets up to 8 Exabytes.
