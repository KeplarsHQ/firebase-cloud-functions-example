# Contributing to Keplars Firebase Example

Thank you for your interest in contributing to this project!

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in the GitHub Issues
2. If not, create a new issue with:
   - Clear description of the problem or suggestion
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Your environment (OS, Node version, Firebase CLI version, etc.)

### Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/keplers-examples.git
   cd keplers-examples/firebase-cloud-functions-example
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**
   ```bash
   cd functions
   npm install
   npm run build
   firebase emulators:start
   # Run your tests
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes

## Development Guidelines

### Code Style

- Use TypeScript with proper types
- Follow ESLint rules (configured in .eslintrc.js)
- Use 2 spaces for indentation
- Add descriptive variable names
- Include error handling

### Testing

- Test all email types (text, HTML, instant, template, scheduled)
- Verify error handling
- Check edge cases
- Test with Firebase emulators before deploying

### Documentation

- Update README.md if adding features
- Add JSDoc for new functions
- Include usage examples

## Areas for Contribution

Here are some ways you can help:

1. **Add more examples**
   - Different email templates
   - Integration with Firebase Auth
   - Integration with Firestore
   - Advanced use cases

2. **Improve documentation**
   - Better explanations
   - More examples
   - Video tutorials

3. **Add features**
   - Firebase Auth integration
   - Firestore logging
   - Bulk email sending
   - Attachment support
   - Template validation

4. **Testing**
   - Unit tests
   - Integration tests
   - Performance tests

5. **Bug fixes**
   - Fix reported issues
   - Improve error messages
   - Handle edge cases

## Code of Conduct

- Be respectful and constructive
- Help others learn
- Welcome newcomers
- Follow GitHub community guidelines

## Questions?

Feel free to open an issue for:
- Questions about the code
- Feature discussions
- General help

Thank you for contributing!
