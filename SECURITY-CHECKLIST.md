# Security Checklist

## Authentication & Authorization
- [ ] All pages that require auth have proper protection
- [ ] Password requirements enforced (8+ chars, uppercase, lowercase, number, special)
- [ ] Session timeout configured
- [ ] Logout clears all tokens and sessions
- [ ] Email verification enabled
- [ ] Password reset flow secure
- [ ] No sensitive data in URLs
- [ ] JWT tokens stored securely (httpOnly cookies preferred)

## Database Security
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] All RLS policies tested and working
- [ ] No public tables unless intended
- [ ] Database backups configured
- [ ] Sensitive data encrypted at rest
- [ ] Database connection strings in environment variables
- [ ] No SQL injection vulnerabilities

## API Security
- [ ] All API endpoints require authentication
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] CORS configured properly
- [ ] API keys/secrets in environment variables
- [ ] No sensitive data in API responses
- [ ] Error messages don't leak information

## Frontend Security
- [ ] All user input sanitized
- [ ] XSS prevention implemented
- [ ] CSRF tokens where needed
- [ ] Content Security Policy configured
- [ ] No sensitive data in localStorage
- [ ] Third-party scripts reviewed
- [ ] Dependencies audited (npm audit)

## File Upload Security
- [ ] File type validation
- [ ] File size limits enforced
- [ ] Files scanned for malware (if possible)
- [ ] Uploaded files stored securely
- [ ] File URLs are unpredictable
- [ ] Image files validated
- [ ] No executable file uploads allowed

## Infrastructure
- [ ] HTTPS enforced everywhere
- [ ] Security headers configured
- [ ] Environment variables secured
- [ ] Secrets not in git history
- [ ] 404 page doesn't leak info
- [ ] Error pages don't expose stack traces
- [ ] Monitoring and alerting configured

## Compliance
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent implemented (if EU users)
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policy defined
- [ ] User data deletion implemented
- [ ] Contact information available

## Testing
- [ ] Security testing performed
- [ ] Penetration testing (if budget allows)
- [ ] Vulnerability scanning
- [ ] Dependencies up to date
- [ ] No known CVEs in dependencies
- [ ] Load testing performed
- [ ] Error scenarios tested
