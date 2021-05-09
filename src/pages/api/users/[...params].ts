import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response:NextApiResponse) => {
  const id = request.query.params[0];
  const param = request.query.params[1];
  
  if(param !== 'some-param') return response.json({
    status: 400,
    message: 'invalid param',
  });

  const users = [
    { id: 1, name: 'Wolf' },
    { id: 2, name: 'Natalie' },
    { id: 3, name: 'Fabrice' },
    { id: 4, name: 'Bárbara' },
  ]

  const user = users.filter(user => user.id === Number(id))

  return response.json(user);
}

// http://localhost:3000/api/users/1/some-param
// http://localhost:3000/api/users/1/wrong-param