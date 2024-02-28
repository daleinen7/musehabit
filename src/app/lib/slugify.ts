const slugify = (title: string, prefix?: string) => {
  // Convert to lowercase
  title = title.toLowerCase();

  // Replace all instances of apostrophes and ’ with '-'
  title = title.replace(/['’]/g, '-');

  // Replace all spaces, colons and colon-hyphens with '-'a
  title = title.replace(/[ :]+/g, '-');

  // Replace all instances of '&' with 'and'
  title = title.replace(/&/g, 'and');

  // Remove all instances of '$'
  title = title.replace(/\$/g, '');

  // Remove all characters not allowed in URLs
  title = title.replace(/[^a-z0-9-]/g, '');

  // Remove all instances of '%', parentheses, exclamation points, question marks, semicolons, commas, and ellipses
  title = title.replace(/[%()!?\.;,\u2026]/g, '');

  // Replace multiple hyphens with a single one
  title = title.replace(/--+/g, '-');

  // Remove all hyphens at the beginning or end of the string
  title = title.replace(/(^-+)|(-+$)/g, '');

  // Return the valid URL string
  return prefix ? `${prefix}${title}` : title;
};

export default slugify;
