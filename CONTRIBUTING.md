# Contributing to BetterIcons

First off, thank you for considering contributing to BetterIcons! It's people like you that make it such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible using our bug report template.

**Good Bug Reports** include:
- A quick summary and/or background
- Steps to reproduce (be specific!)
- What you expected would happen
- What actually happens
- Umbraco version, package version, and .NET version
- Error logs or screenshots if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please use our feature request template and include:
- A clear and descriptive title
- A detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes, if any
4. Update the documentation, if necessary
5. Make sure your code follows the existing code style
6. Issue that pull request!

### Code Style

#### C# Code
- Follow Microsoft's C# coding conventions
- Keep methods focused and small

#### TypeScript/React Code
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Prefer named exports over default exports

#### Commit Messages
Follow the conventional commits specification:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat: add search functionality to BetterIcons
fix: resolve icon rendering issue in Safari
docs: update README with new API examples
```


## Release Process

Releases are automated via GitHub Actions:

1. Create a new tag following semantic versioning:
   ```bash
   git tag -a v1.1.0 -m "Release 1.1.0"
   git push origin v1.1.0
   ```

2. The release workflow will:
   - Create a GitHub release
   - Generate changelog
   - Build and publish to NuGet

## Questions?

Feel free to:
- Open a discussion on GitHub
- Comment on relevant issues
- Reach out to maintainers


Thank you for contributing! 🎉
