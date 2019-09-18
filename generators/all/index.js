const Generator = require('yeoman-generator')
const chalk = require('chalk')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.log(chalk.green('Initializing...'))
    this.option('quiet')
    this.option('skip-package')

    this.quiet = this.options.quiet
    this.skipPackage = this.options.skipPackage
  }

  async prompting() {
    if (this.quiet) {
      this.answers = {
        name: 'es6-project',
        description: 'New ES6 Project',
      }
    } else {
      this.answers = await this.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Project Name',
          default: this.appname, // Default to current folder name
        },
        {
          type: 'input',
          name: 'description',
          message: 'Project Description',
          default: '',
        },
      ])
    }
  }

  async configuring() {
    this.log(chalk.green('Writing template files...'))

    const name = this.answers.name.trim().toLowerCase().replace(/ /g, '-')
    const { description } = this.answers

    const dotConfigs = [
      'editorconfig',
      'eslintrc.js',
      'eslintignore',
      'gitignore',
    ]

    if (!this.skipPackage) {
      this.fs.copyTpl(
        this.templatePath('_config/package.json'),
        this.destinationPath('package.json'),
        {
          name,
          description,
        },
      )
    }

    this.fs.copy(
      this.templatePath('_config/babel.config.js'),
      this.destinationPath('babel.config.js'),
    )

    dotConfigs.map(dotConfig => this.fs.copy(
      this.templatePath(`_config/${dotConfig}`),
      this.destinationPath(`.${dotConfig}`),
    ))
  }

  async install() {
    this.log(chalk.green('Installing...'))

    // const dependencies = []

    const devDependencies = [
      '@babel/cli',
      '@babel/core',
      '@babel/preset-env',
      'babel-eslint',
      'eslint',
      'eslint-config-airbnb',
      'eslint-config-airbnb-base',
      'eslint-plugin-import',
    ]

    await this.yarnInstall(devDependencies, { dev: true, silent: true })
  }
}
