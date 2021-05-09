import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response:NextApiResponse) => {
  const users = [
    { id: 1, name: 'Wolf' },
    { id: 2, name: 'Natalie' },
    { id: 3, name: 'Fabrice' },
    { id: 4, name: 'Bárbara' },
  ]

  return response.json(users);
}

// http://localhost:3000/api/users