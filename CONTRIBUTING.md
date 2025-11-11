# Contributing Guide

Thank you for considering contributing to the OKR Tracker project!

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professional communication

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

## Coding Standards

### Backend (Node.js)

- Use ES6+ features
- Follow ESLint configuration
- Use async/await over promises
- Proper error handling
- Add JSDoc comments for functions
- Keep functions small and focused

Example:
```javascript
/**
 * Creates a new objective
 * @param {string} userId - User ID
 * @param {Object} data - Objective data
 * @returns {Promise<Object>} Created objective
 */
async createObjective(userId, data) {
  // Implementation
}
```

### Frontend (React)

- Use functional components
- Implement proper prop types
- Follow React hooks best practices
- Keep components small and focused
- Use meaningful variable names
- Implement proper error boundaries

Example:
```jsx
export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick 
}) => {
  // Implementation
};
```

### CSS (Tailwind)

- Use Tailwind utility classes
- Avoid custom CSS when possible
- Follow dark mode patterns
- Use consistent spacing

## Git Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Test additions

### Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(auth): add password reset functionality
fix(objectives): resolve progress calculation bug
docs(readme): update installation instructions
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Test Coverage

Aim for:
- Unit tests: 80%+ coverage
- Integration tests: Key workflows
- E2E tests: Critical user paths

## Pull Request Process

1. **Update Documentation**
   - Update README if needed
   - Add/update comments
   - Update API docs

2. **Test Your Changes**
   - Run all tests
   - Test manually
   - Check for regressions

3. **Create Pull Request**
   - Clear title and description
   - Reference related issues
   - Add screenshots if UI changes
   - Request reviews

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] Added new tests
   - [ ] Manual testing completed
   
   ## Screenshots (if applicable)
   
   ## Related Issues
   Fixes #123
   ```

5. **Review Process**
   - Address feedback
   - Update as needed
   - Maintain conversation

## Code Review Guidelines

### For Reviewers

- Be constructive and specific
- Suggest improvements
- Approve when satisfied
- Check for security issues

### For Contributors

- Respond to feedback
- Ask questions if unclear
- Make requested changes
- Be patient and professional

## Project Structure

Maintain the existing structure:

```
backend/
├── src/
│   ├── config/       # Configuration
│   ├── core/         # Core utilities
│   ├── middleware/   # Express middleware
│   ├── modules/      # Feature modules
│   ├── utils/        # Utility functions
│   └── validators/   # Input validation

frontend/
├── src/
│   ├── app/          # App configuration
│   ├── components/   # Reusable components
│   ├── features/     # Feature modules
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Page components
│   ├── services/     # API services
│   └── store/        # State management
```

## Adding New Features

### Backend

1. Create module in `src/modules/`
2. Add service layer (business logic)
3. Add controller (HTTP handlers)
4. Add routes
5. Add validators
6. Update tests

### Frontend

1. Create feature in `src/features/`
2. Add service calls
3. Create components
4. Add to router
5. Update state if needed
6. Add tests

## Documentation

- Update README for major changes
- Add JSDoc/comments for functions
- Update API documentation
- Include examples

## Questions?

- Open an issue for discussion
- Join community chat (if available)
- Email maintainers

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Mentioned in release notes
- Acknowledged in the project

Thank you for contributing! 🎉
