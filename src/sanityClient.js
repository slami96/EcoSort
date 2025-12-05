import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Create Sanity client
export const client = createClient({
  projectId: '1aakh29l', 
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

// Image URL builder
const builder = imageUrlBuilder(client);

export const urlFor = (source) => {
  return builder.image(source);
};
