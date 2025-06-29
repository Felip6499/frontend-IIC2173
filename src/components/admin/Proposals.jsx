import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getOffers, respondToProposal } from '../../utils/api';

function Proposals() {
    const [proposals, setProposals] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    const fetchProposals = async () => {
        const token = await getAccessTokenSilently();
        const offersData = await getOffers(token);
        const myOffers = offersData.filter(o => String(o.group_id) === process.env.REACT_APP_GROUP_ID);
        const allProposals = myOffers.flatMap(offer => offer.proposals.map(p => ({...p, offerSymbol: offer.symbol})));
        setProposals(allProposals.filter(p => p.state === 'pending'));
    };
    
    useEffect(() => {
        fetchProposals();
    }, []);

    const handleResponse = async (proposal_id, response) => {
        try {
            const token = await getAccessTokenSilently();
            await respondToProposal(proposal_id, response, token);
            alert(`Propuesta ${response === 'accept' ? 'aceptada' : 'rechazada'}.`);
            fetchProposals();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Propuestas Recibidas</h1>
            {proposals.map(p => (
                <div key={p.proposal_id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                    <p>Propuesta en tu oferta de {p.offerSymbol}:</p>
                    <p>Grupo {p.group_id} ofrece {p.quantity} de {p.symbol}</p>
                    <button onClick={() => handleResponse(p.proposal_id, 'accept')}>Aceptar</button>
                    <button onClick={() => handleResponse(p.proposal_id, 'reject')}>Rechazar</button>
                </div>
            ))}
        </div>
    );
}

export default Proposals;