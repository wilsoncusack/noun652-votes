import { NextApiRequest, NextApiResponse } from 'next';
import { gql } from '@apollo/client';
import apolloClient from '../../lib/apolloClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = await apolloClient.query({
    query: gql`
      query GetVotesByNoun($nounId: BigInt!) {
        votes(where: { nouns_: { id: $nounId } }, orderBy: blockNumber, orderDirection: desc) {
          id
          support
          supportDetailed
          votes
          reason
          voter {
            id
          }
          proposal {
            id
            title
          }
        }
      }
    `,
    variables: {
      nounId: 652,
    },
  });

  res.status(200).json(data.votes);
}
