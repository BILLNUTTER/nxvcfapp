interface Contact {
  name: string;
  phone_number: string; // ALWAYS stored with country code without '+'
  link?: string;
}

/**
 * Normalize phone number:
 * - Remove non-digits
 * - Convert local numbers starting with '0' to include default country code
 * - Supports Kenya (254), Tanzania (255), Nigeria (234)
 */
function normalizeNumber(number: string, defaultCountryCode: '254' | '255' | '234' = '254'): string {
  let cleaned = number.replace(/\D/g, ''); // remove all non-digits

  // Handle local numbers starting with 0
  if (cleaned.startsWith('0')) {
    cleaned = defaultCountryCode + cleaned.slice(1);
  }

  // If shorter than expected, prepend default country code
  if (
    (defaultCountryCode === '254' || defaultCountryCode === '255') && cleaned.length === 9
  ) {
    cleaned = defaultCountryCode + cleaned;
  }
  if (defaultCountryCode === '234' && cleaned.length === 10) {
    cleaned = defaultCountryCode + cleaned;
  }

  return cleaned;
}

/**
 * Generate a VCF string from contacts
 * - Adds 🔥 emoji to names
 * - Removes duplicates (merging numbers with/without country code)
 */
export function generateVCF(contacts: Contact[]): string {
  const seenNumbers = new Set<string>();
  let vcfContent = '';

  contacts.forEach(contact => {
    // Infer default country code from number prefix if possible
    let defaultCC: '254' | '255' | '234' = '254';
    if (contact.phone_number.startsWith('255')) defaultCC = '255';
    else if (contact.phone_number.startsWith('234')) defaultCC = '234';

    const normalizedNumber = normalizeNumber(contact.phone_number, defaultCC);

    if (seenNumbers.has(normalizedNumber)) return; // skip duplicates
    seenNumbers.add(normalizedNumber);

    vcfContent += 'BEGIN:VCARD\n';
    vcfContent += 'VERSION:3.0\n';
    vcfContent += `FN:${contact.name} 🔥\n`; // add fire emoji
    vcfContent += `N:${contact.name};;;;\n`;
    vcfContent += `TEL;TYPE=CELL:+${normalizedNumber}\n`; // add '+' for VCF
    if (contact.link) {
      vcfContent += `URL:${contact.link}\n`;
    }
    vcfContent += 'END:VCARD\n';
  });

  return vcfContent;
}

/**
 * Download VCF as a file
 */
export function downloadVCF(vcfContent: string, filename: string = 'nutterx_contacts.vcf'): void {
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
