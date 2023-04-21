import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { Address, useEnsName } from 'wagmi';
import { WagmiConfig, createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
 
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
)
 
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

interface Voter {
  id: string;
  ensName?: string;
}

interface Proposal {
  id: string;
  title: string;
}

interface Vote {
  id: string;
  support: boolean;
  supportDetailed: number;
  votes: string;
  reason?: string;
  voter: Voter;
  proposal: Proposal;
}

export default function Home() {
  const [votes, setVotes] = useState<Vote[]>([]);

  useEffect(() => {
    const fetchVotes = async () => {
      const response = await fetch('/api/getVotes');
      const data = await response.json();
      setVotes(data);
    };

    fetchVotes();
  }, []);

  return (
    <WagmiConfig client={client}>
    <div className={styles.container}>
      <img src="/652.svg" alt="652 Image" className={styles.logo} />
      <h1>Noun 652 Votes With Reason</h1>
      <table>
        <thead>
          <tr>
            <th>Proposal</th>
            <th>Title</th>
            <th>Voter</th>
            <th>Support</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote) => (
            <VoteRow vote = {vote} key={vote.id} />
          ))}
        </tbody>
      </table>
    </div>
    </WagmiConfig>
  );
}

interface VoteRowProps {
  vote: Vote;
}

const VoteRow: React.FC<VoteRowProps> = ({ vote }) => {
  const { data, isError, isLoading } = useEnsName({
    address: vote.voter.id as Address,
  })

  return (
    <tr key={vote.id}>
      <td><a href={`https://nouns.wtf/vote/${vote.proposal.id}`} target="_blank">{vote.proposal.id}</a></td>
      <td>{vote.proposal.title}</td>
      <td>{isError ? vote.voter.id : data}</td>
      <td>{vote.support ? 'For' : 'Against'}</td>
      <td>{vote.reason || 'Not Provided'}</td>
    </tr>
  );
};
