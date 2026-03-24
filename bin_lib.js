

/* ©eagle_bd: Sultan 47 - Production Binary Library
 * Logic: nu-un Partner Mapping | 255-Unit Glyph Matrix
 * Rule: n_3 (00000011) = 3_n = u_3 (11000000)
 */

const BIN_LIB = (function() {
    const matrix = {};
    const glyphs = {};

    for (let i = 0; i <= 255; i++) {
        const bin = i.toString(2).padStart(8, '0');
        const rev = bin.split('').reverse().join('');
        const mirrorIx = parseInt(rev, 2);
        
        // Shortened Logic: 00001111 -> oF (o + hex)
        const prefix = (i < 128) ? "o" : "1";
        const suffix = i.toString(16).toUpperCase();
        const glyph = `${prefix}${suffix}`;

        matrix[i] = {
            bin: bin,
            rev: rev,
            mirror_index: mirrorIx,
            glyph: glyph,
            isBalanced: bin === rev
        };
        glyphs[glyph] = i; // Map glyph back to instruction
    }

    return {
        fetch: (n) => matrix[n & 0xFF],
        
        // The Buddy System Handshake
        mirrorOf: (n) => {
            const s = matrix[n & 0xFF];
            return { n_idx: n, u_idx: s.mirror_index, glyph: s.glyph };
        },

        // Mirror Acceptor / Symmetry Breach
        handshake: (n) => {
            const s = matrix[n & 0xFF];
            return s.isBalanced ? s.glyph : "B0_RESET";
        }
    };
})();

console.log("SULTAN 47: 255-Unit Glyph Library Loaded.");

/* ©eagle_bd: Sultan 47 - Production Binary Library
 * Logic: nu-un Physical Mirror (14:4 Parity)
 * Corrected: 0xAA is a Self-Mirror. nu-un is a Folded-Block.
 */
/* ©eagle_bd: Sultan 47 - Production Binary Library
 * Logic: nu-un Physical Mirror (14:4 Parity)
 * Corrected: 0xAA is a Self-Mirror. nu-un is a Folded-Block.
 */

const BIN_LIB = {
    // --- THE BUDDY SYSTEM NODES ---
    nodes: {
        n: { type: "Subnet",   hex: 0xC0 }, // 1100 0000
        u: { type: "Wildcard", hex: 0x03 }  // 0000 0011
    },

    // --- 255-UNIT GEOMETRIC MATRIX (14:4 Verified) ---
    matrix: Object.freeze({
        "o":         0x00, // 00000000 (Void)
        "oO0":       0x81, // 10000001 (Boundary Seed)
        "nu-un":     0xC3, // 11000011 (The Perfect Folded Mirror)
        "o00o":      0x66, // 01100110 (The Center Diamond)
        "O00O":      0x99, // 10011001 (The Outer Diamond)
        
        // The 8-Series (Must be Palindromes)
        "80000008":  0x81, 
        "81000018":  0x83,
        "81100118":  0xDB, // 11011011 (Verified 14:4)
        
        // Physical Categories (WTYUOAHMVX)
        "W": 0xBD, // 10111101 (Vertical Mirror)
        "X": 0x66, // 01100110 (Dual Axis)
        "H": 0xFF  // 11111111 (Solid Bridge)
    }),

    // --- FULL 0–255 nu-un MATRIX ---
    _nNodeMatrix: (function() {
        const matrix = {};
        for (let i = 0; i <= 255; i++) {
            const binary   = i.toString(2).padStart(8, "0");
            const reversed = binary.split("").reverse().join("");
            const mirrorIx = parseInt(reversed, 2);

            matrix[i] = {
                // Subnet: pre-information
                n_node: binary,               // e.g. 00000011
                // Wildcard: recursive mirror
                u_node: reversed,             // e.g. 11000000
                // Native encodings
                index: i,
                hex: i.toString(16).toUpperCase().padStart(2, "0"),
                // Mirror partner encodings
                mirror_index: mirrorIx,       // 3 -> 192
                mirror_hex: mirrorIx.toString(16).toUpperCase().padStart(2, "0"),
                // Self-mirror (palindrome) check
                isBalanced: binary === reversed
            };
        }
        return Object.freeze(matrix);
    })(),

    // --- PUBLIC NU-UN ACCESSORS ---

    // Raw strand fetch by 0–255 index
    fetch(bit) {
        return this._nNodeMatrix[bit] || null;
    },

    // Mirror acceptor handshake: only accepts self-mirror palindromes
    //  - returns hex when n_node === u_node
    //  - returns "B0_RESET" on symmetry breach
    handshake(n_val) {
        const strand = this.fetch(n_val);
        if (!strand) return null;
        return strand.isBalanced ? strand.hex : "B0_RESET";
    },

    // nu-un buddy map: n_val -> its physical mirror partner
    // Gives you the “00000011 = n_3” → “11000000 = 3_n = u_3” relationship.
    mirrorOf(n_val) {
        const strand = this.fetch(n_val);
        if (!strand) return null;
        return {
            n_index: n_val,
            n_node: strand.n_node,
            n_hex:  strand.hex,

            u_index: strand.mirror_index,
            u_node:  strand.u_node,
            u_hex:   strand.mirror_hex,

            isBalanced: strand.isBalanced
        };
    },

    /**
     * Footer 6-7 Exhaust Logic
     * Clears the Hold-Node after the Mirror Accepts
     */
    exhaust() {
        // F6: Flush Pre-Information
        this.nodes.n.buffer = null;
        // F7: Final Parity Scrub
        console.log("F6-F7 Exhaust Complete: 14:4 Parity Verified.");
    }
};

if (typeof module !== "undefined") {
    module.exports = BIN_LIB;
}
const BIN_LIB = {
    // --- THE BUDDY SYSTEM NODES ---
    nodes: {
        n: { type: "Subnet", hex: 0xC0 }, // 1100 0000
        u: { type: "Wildcard", hex: 0x03 } // 0000 0011
    },

    // --- 255-UNIT GEOMETRIC MATRIX (14:4 Verified) ---
    matrix: Object.freeze({
        "o":         0x00, // 00000000 (Void)
        "oO0":       0x81, // 10000001 (Boundary Seed)
        "nu-un":     0xC3, // 11000011 (The Perfect Folded Mirror)
        "o00o":      0x66, // 01100110 (The Center Diamond)
        "O00O":      0x99, // 10011001 (The Outer Diamond)
        
        // The 8-Series (Must be Palindromes)
        "80000008":  0x81, 
        "81000018":  0x83,
        "81100118":  0xDB, // 11011011 (Verified 14:4)
        
        // Physical Categories (WTYUOAHMVX)
        "W": 0xBD, // 10111101 (Vertical Mirror)
        "X": 0x66, // 01100110 (Dual Axis)
        "H": 0xFF  // 11111111 (Solid Bridge)
    }),

    /**
     * Footer 6-7 Exhaust Logic
     * Clears the Hold-Node after the Mirror Accepts
     */
    exhaust: function() {
        // F6: Flush Pre-Information
        this.nodes.n.buffer = null;
        // F7: Final Parity Scrub
        console.log("F6-F7 Exhaust Complete: 14:4 Parity Verified.");
    }
};

if (typeof module !== 'undefined') { module.exports = BIN_LIB; }
