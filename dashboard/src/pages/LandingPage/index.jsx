import React from 'react';
import { Button } from '@chakra-ui/react';

export function LandingPage(props) {
    const login = () => window.location.href = 'http://localhost:3001/api/auth/discord';
    return(
        <Button onClick={ login } colorScheme="telegram">Discord</Button>
    )
}