// .release-it.js
module.exports = {
  git: {
    commitMessage: 'chore: release ${version}',
    tagName: 'v${version}',
  },
  github: {
    release: true,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
      changelogPreset: {
        types: [
          {type: 'feat', section: 'Features', hidden: false},
          {type: 'fix', section: 'Bug Fixes', hidden: false},
          {type: 'chore', section: 'Chores', hidden: false},
          {type: 'refactor', section: 'Refactors', hidden: false},
          {type: 'docs', section: 'Documentation', hidden: false},
          {type: 'style', section: 'Style', hidden: false},
          {type: 'test', section: 'Tests', hidden: false},
          {type: 'perf', section: 'Performance', hidden: false},
          {type: 'ci', section: 'CI/CD', hidden: false},
          {type: 'build', section: 'Build', hidden: false},
        ],
      },
      whatBump: commits => {
        return {level: 1, reason: 'New release version'};
      },
    },
  },
};
