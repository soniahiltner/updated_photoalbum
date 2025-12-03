const pictures = [
  {
    _id: '1',
    url: '/images/logo.png',
    filename: 'logo.png',
    isFavourite: false,
    albums: ['Portfolio'],
  },
  {
    _id: '2',
    url: '/images/sample1.jpg',
    filename: 'sample1.jpg',
    isFavourite: false,
    albums: ['Portfolio', 'Nature'],
  },
  {
    _id: '3',
    url: '/images/sample2.jpg',
    filename: 'sample2.jpg',
    isFavourite: false,
    albums: ['Portfolio', 'Urban'],
  }
]

async function fetchPictures() {
  return pictures
}

export { fetchPictures }