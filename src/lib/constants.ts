/**
 * Site-wide constants
 */
export const SITE_URL = 'https://lab.example.com';

export const WORDS_PER_MINUTE = 200;

/**
 * Validation level configuration for co-authored content
 */
export const VALIDATION_CONFIG = {
  experimental: {
    label: 'Experimental',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    description: 'This content is experimental and may need further testing.',
  },
  tested: {
    label: 'Tested',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'This content has been tested and validated.',
  },
  production: {
    label: 'Production',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    description: 'This content is production-ready and thoroughly validated.',
  },
} as const;

export type ValidationLevel = keyof typeof VALIDATION_CONFIG;
