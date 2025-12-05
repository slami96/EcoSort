export default {
  name: 'recyclingItem',
  title: 'Recycling Item',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Item Name',
      type: 'string',
      description: 'Name of the recyclable item (e.g., "Plastic Water Bottle")',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Category this item belongs to',
      options: {
        list: [
          {title: 'Plastic', value: 'Plastic'},
          {title: 'Paper', value: 'Paper'},
          {title: 'Glass', value: 'Glass'},
          {title: 'Metal', value: 'Metal'},
          {title: 'Electronics', value: 'Electronics'},
          {title: 'Organic', value: 'Organic'},
          {title: 'Textiles', value: 'Textiles'},
          {title: 'Batteries', value: 'Batteries'},
          {title: 'Hazardous', value: 'Hazardous'}
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the item',
      validation: Rule => Rule.required().max(200)
    },
    {
      name: 'image',
      title: 'Image URL',
      type: 'url',
      description: 'URL to item image (optional)'
    },
    {
      name: 'howToRecycle',
      title: 'How to Recycle',
      type: 'text',
      description: 'Instructions on how to properly recycle this item',
      validation: Rule => Rule.required()
    },
    {
      name: 'preparation',
      title: 'Preparation Steps',
      type: 'text',
      description: 'Steps to prepare the item for recycling (one per line)',
      placeholder: 'Rinse thoroughly\nRemove labels\nFlatten if possible'
    },
    {
      name: 'tips',
      title: 'Sustainability Tips',
      type: 'text',
      description: 'Additional tips for reducing waste or reusing the item'
    },
    {
      name: 'impact',
      title: 'Environmental Impact',
      type: 'string',
      description: 'Short statement about the positive impact of recycling this item',
      placeholder: 'Saves 70% energy compared to producing new plastic'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image'
    }
  }
}
