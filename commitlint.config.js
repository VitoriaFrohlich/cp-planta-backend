module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce the use of conventional commit types
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Features
        'fix',      // Bug fixes
        'chore',    // Maintenance tasks
        'docs',     // Documentation changes
        'style',    // Code style changes (formatting, missing semi-colons, etc.)
        'refactor', // Code refactoring without adding features or fixing bugs
        'perf',     // Performance improvements
        'test',     // Adding or updating tests
        'build',    // Changes to build process or dependencies
        'ci',       // CI configuration changes
      ],
    ],
    // Enforce that the subject is not empty
    'subject-empty': [2, 'never'],

    // Enforce lowercase for the subject
    'subject-case': [2, 'always', 'lower-case'],

    // Optional: Enforce lowercase for the type as well
    'type-case': [2, 'always', 'lower-case'],
  },
};
