/**
 * Normalizes a URL by removing protocols, www, and trailing slashes
 * @param url - The URL to normalize
 * @returns The normalized URL
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  
  let normalized = url.toLowerCase().trim();
  
  // Remove protocols
  normalized = normalized.replace(/^https?:\/\//, '');
  
  // Remove www
  normalized = normalized.replace(/^www\./, '');
  
  // Remove trailing slashes and paths
  normalized = normalized.split('/')[0];
  
  // Remove query parameters and fragments
  normalized = normalized.split('?')[0].split('#')[0];
  
  return normalized;
}

/**
 * Validates if a URL has a valid format
 * @param url - The URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/.*)?$/i;
  return urlPattern.test(url.trim());
}

/**
 * Validates if an email has a valid format
 * @param email - The email to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
}

/**
 * Extracts domain from email address
 * @param email - The email address
 * @returns The domain part of the email
 */
export function getEmailDomain(email: string): string {
  if (!email || !isValidEmail(email)) return '';
  
  return email.split('@')[1].toLowerCase();
}

/**
 * Checks if email domain matches website domain
 * @param email - User's email address
 * @param website - Website URL to check against
 * @returns Boolean indicating if domains match
 */
export function isEmailDomainAuthorized(email: string, website: string): boolean {
  if (!email || !website) return false;
  
  const emailDomain = getEmailDomain(email);
  const websiteDomain = normalizeUrl(website);
  
  // Direct match
  if (emailDomain === websiteDomain) return true;
  
  // Subdomain match (e.g., marketing@company.com can access company.com)
  if (emailDomain.endsWith('.' + websiteDomain)) return true;
  
  // Parent domain match (e.g., user@company.com can access subdomain.company.com)
  if (websiteDomain.endsWith('.' + emailDomain)) return true;
  
  return false;
}

/**
 * Submits email to SheetDB API for tracking (fire-and-forget)
 * @param email - User's email address
 * @param website - Website being assessed
 */
export function submitEmailToSheet(email: string, website: string): void {
  // Fire-and-forget: don't wait for response, don't block user experience
  fetch('https://sheetdb.io/api/v1/b64z2r03y8n64', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: email.toLowerCase(),
      website: normalizeUrl(website),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100)
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Email submitted successfully to SheetDB');
    } else {
      console.warn(`SheetDB API error: ${response.status}`);
    }
  })
  .catch(error => {
    // Log error but don't break user experience
    console.warn('Failed to submit email to SheetDB:', error);
  });
}

/**
 * Submits waitlist email to SheetDB with key `waitlistemail` (no validation)
 */
export function submitWaitlistEmail(email: string): void {
  fetch('https://sheetdb.io/api/v1/b64z2r03y8n64', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      waitlistemail: (email || '').toLowerCase()
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Waitlist email submitted to SheetDB');
    } else {
      console.warn(`SheetDB API error: ${response.status}`);
    }
  })
  .catch(error => {
    console.warn('Failed to submit waitlist email to SheetDB:', error);
  });
}

/**
 * Submits website landing page email to SheetDB with key `websitelandingpage` (no validation)
 */
export function submitWebsiteLandingPageEmail(email: string): void {
  fetch('https://sheetdb.io/api/v1/b64z2r03y8n64', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      pulpmarketingai: (email || '').toLowerCase()
    })
  })
  .then(response => {
    if (response.ok) {
      console.log('Website landing page email submitted to SheetDB');
    } else {
      console.warn(`SheetDB API error: ${response.status}`);
    }
  })
  .catch(error => {
    console.warn('Failed to submit website landing page email to SheetDB:', error);
  });
}
