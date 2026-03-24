/* ©eagle_bd: Sultan 47 - Physical Category Parser
 * Subnet Logic: Nu-un (Fixed to Wildcard Mirror)
 */

const CATS = {
    UPPER:  ['W','T','Y','U','O','A','H','M','V','X'],
    LOWER:  ['x','v','l','w','o','n','u'],
    PAIRS:  { 'q':'p', 'p':'q', 'b':'d', 'd':'b', 'n':'u', 'u':'n' },
    ANCHOR: ['8', '0']
};

/**
 * The Sultan 47 Handshake
 * Validates the physical symmetry of the strand.
 */
function validatePhysical(strand) {
    const chars = [...strand];
    const first = chars[0];
    const last = chars[chars.length - 1];

    // RULE 1: Anchor Symmetry (8...8 or 0...0)
    if (CATS.ANCHOR.includes(first) && first !== last) return false;

    // RULE 2: Nu-un Subnet Mirroring
    // If the strand starts with 'n' (Subnet), it must resolve with 'u' (Wildcard).
    if (first === 'n' && last !== 'u') return false;
    if (first === 'u' && last !== 'n') return false;

    // RULE 3: Sovereign Upper Alignment
    if (CATS.UPPER.includes(first) && !CATS.UPPER.includes(last)) return false;

    return true; // Strand is physically balanced for execution
}
