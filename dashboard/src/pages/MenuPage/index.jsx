import React from 'react';
import { MenuComponent } from '../../components';
import { getGuilds, getUserDetails } from '../../utils/api';

export function MenuPage({ history }) {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [guilds, setGuilds] = React.useState([]);

    React.useEffect(() => {
        getUserDetails().then(({ data }) => {
            console.log(data);
            setUser(data);
            setLoading(false);
            return getGuilds();
        }).then(({ data }) => {
            console.log(data);
            setGuilds(data);
        }).catch((err) => {
            history.push('/');
            setLoading(false);
        });
    }, [history]);
    return !loading && (
        <div>
            <h1>Menu Page</h1>
            <MenuComponent guilds={ guilds }/>
        </div>
    )
}